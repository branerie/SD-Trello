import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom"
import Button from '../../components/button'
import CreateList from '../../components/create-list'
import EditProject from '../../components/edit-project'
import List from '../../components/list'
import PageLayout from '../../components/page-layout'
import Transparent from '../../components/transparent'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import styles from './index.module.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import TableDndApp from '../../components/calendar-table'

export default function CalendarView() {
    const params = useParams()
    const history = useHistory()
    const [project, setProject] = useState(null)
    const [lists, setLists] = useState([])
    const [members, setMembers] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [IsVisibleEdit, setIsVisibleEdit] = useState(false)
    const socket = useSocket()

    const showForm = () => {
        setIsVisible(true)
    }

    const hideForm = () => {
        setIsVisible(false)
    }

    const showFormEdit = () => {
        setIsVisibleEdit(true)
    }

    const hideFormEdit = () => {
        setIsVisibleEdit(false)
    }

    const projectUpdate = useCallback((project) => {

        setProject(project)

        const memberArr = []
        project.membersRoles.map(element => {
            return memberArr.push({ admin: element.admin, username: element.memberId.username })

        })
        setMembers(memberArr)
        setLists(project.lists)
    }, [])

    useEffect(() => {
        if (socket == null) return

        socket.on('project-updated', projectUpdate)

        return () => socket.off('project-updated')
    }, [socket, projectUpdate])


    const getData = useCallback(async () => {
        const id = params.projectid
        const token = getCookie("x-auth-token");

        const response = await fetch(`http://localhost:4000/api/projects/info/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const data = await response.json()
            setProject(data)
            const memberArr = []
            data.membersRoles.map(element => {
                return memberArr.push({ admin: element.admin, username: element.memberId.username, id: element.memberId._id })

            })
            setMembers(memberArr)
            setLists(data.lists)
        }


    }, [params.projectid, history])


    useEffect(() => {
        getData()
    }, [getData])

    if (!project) {
        return (
            <PageLayout>
                <div>Loading...</div>
            </PageLayout>
        )
    }

    async function deleteProject() {
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/${project._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            history.push('/projects')
        }
    }

    async function handleOnDragEnd(result) {
        if (!result.destination) return


        if (result.type === 'droppableItem') {
            const position = result.destination.index
            const token = getCookie("x-auth-token")
            const response = await fetch(`http://localhost:4000/api/projects/lists/${project._id}/${result.draggableId}/dnd-update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    position,
                    element: 'list'
                })
            })
            if (!response.ok) {
                history.push("/error")
            } else {
                // const newListsArr = [...lists]
                // const [reorderedList] = newListsArr.splice(result.source.index, 1)
                // newListsArr.splice(result.destination.index, 0, reorderedList)

                // await setLists(newListsArr)
            }
        }

        if (result.type === 'droppableSubItem') {
            const position = result.destination.index
            const source = result.source.droppableId
            const destination = result.destination.droppableId
            const token = getCookie("x-auth-token")
            const response = await fetch(`http://localhost:4000/api/projects/lists/${project._id}/${result.draggableId}/dnd-update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    position,
                    element: 'card',
                    source,
                    destination
                })
            })
            if (!response.ok) {
                history.push("/error")
            } else {
                // const newListsArr = [...lists]
                // const [reorderedList] = newListsArr.splice(result.source.index, 1)
                // newListsArr.splice(result.destination.index, 0, reorderedList)

                // setLists(newListsArr)
            }
        }
        getData()
    }

    async function defaultView() {
        const id = params.projectid
        history.push(`/projects/${id}`)
    }


    const today = new Date(),
        date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    const weekDay = today.getDay()


    return (
        <PageLayout className={styles.conteiner}>
            <Button onClick={defaultView} title='Default View' />
            <div className={styles.calendarPageContainer}>
                <span className={styles.projectInfoContainer}>
                    <div>{project.name}</div >
                    <div>
                        Admins :{members.filter(a => a.admin === true).map((element, index) => {
                        return (
                            <div key={index}>
                                {element.username}
                            </div>
                        )
                    }
                    )}
                    </div>
                    <div>
                        Members :{members.filter(a => a.admin === false).map((element, index) => {
                        return (
                            <div key={index}>
                                {element.username}
                            </div>
                        )
                    }
                    )}
                    </div>

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId='project' type='droppableItem'>
                            {(provided) => (
                                <div ref={provided.innerRef}>
                                    {
                                        lists.map((element, index) => {
                                            return (
                                                <Draggable key={element._id} draggableId={element._id} index={index}>
                                                    {(provided) => (
                                                        <div>
                                                            <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                                <List list={element} project={project} />
                                                            </div>
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <Button title='Add List' onClick={showForm} />
                    {
                        isVisible ?
                            <div>
                                <Transparent hideForm={hideForm}>
                                    <CreateList hideForm={hideForm} project={project} />
                                </Transparent>
                            </div> : null
                    }
                    <Button title='Edit Project' onClick={showFormEdit} />
                    {
                        IsVisibleEdit ?
                            < div >
                                <Transparent hideForm={hideFormEdit} >
                                    <EditProject hideForm={hideFormEdit} project={project} members={members} />
                                </Transparent >
                            </div > : null
                    }
                    <Button title='Delete Project' onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteProject() }} />
                </span>
            <span className={styles.calendarContainer}>
                <TableDndApp />
            </span>
            </div>
        </PageLayout >
    )
}
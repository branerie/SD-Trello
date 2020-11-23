import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom"
import Button from '../../components/button'
import EditProject from '../../components/edit-project'
import List from '../../components/list'
import PageLayout from '../../components/page-layout'
import Transparent from '../../components/transparent'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import styles from './index.module.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import pic from '../../images/pic.svg'
import ListContext from '../../contexts/ListContext'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

export default function ProjectPage() {
    const params = useParams()
    const history = useHistory()
    const [project, setProject] = useState(null)
    const [members, setMembers] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [IsVisibleEdit, setIsVisibleEdit] = useState(false)
    const [listName, setListName] = useState('')
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
    const socket = useSocket()
    const listContext = useContext(ListContext)

    const projectUpdate = useCallback((project) => {

        setProject(project)

        const memberArr = []
        project.membersRoles.map(element => {
            return memberArr.push({ admin: element.admin, username: element.memberId.username })

        })
        setMembers(memberArr)
        listContext.setLists(project.lists)
    }, [listContext])

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
            listContext.setLists(data.lists)
        }

    }, [params.projectid, history, listContext])

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
            let position = result.destination.index

            const filteredList = listContext.lists.filter(element => !(listContext.hiddenLists.includes(element._id)))
            const previousId = filteredList[position - 1]
            position = listContext.lists.indexOf(previousId) + 1

            const token = getCookie("x-auth-token")
            const response = await fetch(`http://localhost:4000/api/projects/lists/${project._id}/${result.draggableId}/dnd-update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    position,
                    element: 'list',
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

    async function calendarView() {
        const id = params.projectid
        history.push(`/calendarView/${id}`)
    }

    const addList = async (e) => {
        e.preventDefault()

        if (listName === "") {
            console.log('return');
            return
        }
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/${project._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ name: listName })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            setIsVisible(!isVisible)
            setListName('')
        }

    }

    return (
        <PageLayout>
            {/* <div>{project.name}</div>
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
                </div> */}
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='droppable' direction='horizontal' type='droppableItem'>
                    {(provided) => (
                        <div className={styles.flex} ref={provided.innerRef} >
                            {
                                listContext.lists
                                    .filter(element => !(listContext.hiddenLists.includes(element._id)))
                                    .map((element, index) => {
                                        return (
                                            <Draggable key={element._id} draggableId={element._id} index={index}>
                                                {(provided) => (
                                                    <div>
                                                        <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                            <List list={element} project={project} />
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    })
                            }
                            <div className={styles.list} >
                                {
                                    isActive ?
                                        <form ref={dropdownRef} className={styles.container} >
                                            <input className={styles.input} type={'text'} value={listName} onChange={e => setListName(e.target.value)} />
                                            <button type='submit' className={styles.addlist} onClick={addList} >+ Add List</button>
                                        </form> : <button className={styles.addlist} onClick={() => setIsActive(!isActive)} >+ Add List</button>
                                }

                            </div>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <Button title='Edit Project' onClick={() => setIsVisibleEdit(!IsVisibleEdit)} />
            {
                IsVisibleEdit ?
                    < div >
                        <Transparent hideForm={() => setIsVisibleEdit(!IsVisibleEdit)} >
                            <EditProject hideForm={() => setIsVisibleEdit(!IsVisibleEdit)} project={project} members={members} />
                        </Transparent >
                    </div > : null
            }
            <Button title='Delete Project' onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteProject() }} />
            <Button onClick={calendarView} title='Calendar View' />
            <img className={styles.pic} src={pic} alt="" width="373" height="312" />
        </PageLayout>
    )
}
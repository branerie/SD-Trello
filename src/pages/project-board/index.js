import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom"
import EditProject from '../../components/edit-project'
import List from '../../components/list'
import PageLayout from '../../components/page-layout'
import Transparent from '../../components/transparent'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import styles from './index.module.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import pic from '../../images/pic.svg'
import ProjectContext from '../../contexts/ProjectContext'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import Loader from 'react-loader-spinner'
import ButtonClean from '../../components/button-clean'
import EditCard from '../../components/edit-card'
import UserContext from '../../contexts/UserContext'
import EditList from '../../components/edit-list'


export default function ProjectBoard(props) {
    const params = useParams()
    const history = useHistory()
    const [members, setMembers] = useState([])
    const [IsVisibleEdit, setIsVisibleEdit] = useState(false)
    const [isVisibleEditList, setIsVisibleEditList] = useState(false)
    const [listName, setListName] = useState('')
    const listRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(listRef)
    const socket = useSocket()
    const projectContext = useContext(ProjectContext)
    const [isVisible, setIsVisible] = useState(false)
    const [currCard, setCurrCard] = useState('')
    const [currList, setCurrList] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const context = useContext(UserContext)
    const teamId = params.teamid

    const projectUpdate = useCallback((project) => {

        projectContext.setProject(project)

        const memberArr = []
        project.membersRoles.map(element => {
            return memberArr.push({ admin: element.admin, username: element.memberId.username })

        })
        setMembers(memberArr)
        projectContext.setLists(project.lists)
    }, [projectContext])



    useEffect(() => {
        const id = params.projectid

        if (socket == null) return

        socket.on('project-updated', projectUpdate)

        socket.emit('project-join', id)
        return () => socket.off('project-updated')
    }, [socket, projectUpdate, params.projectid])




    useEffect(() => {
        if (!projectContext.project || projectContext.project._id !== params.projectid) {
            return
        }



        const memberArr = []
        projectContext.project.membersRoles.map(element => {
            return memberArr.push({ admin: element.admin, username: element.memberId.username, id: element.memberId._id })

        })
        setMembers(memberArr)
        projectContext.setLists(projectContext.project.lists)
        const member = memberArr.find(m => m.id === context.user.id)

        if (member) {
            setIsAdmin(member.admin)
        }




    }, [projectContext.project, params.projectid, projectContext, context.user.id])


    const updateUserRecentProjects = useCallback(async () => {
        const userId = context.user.id
        let updatedUser = { ...context.user }
        let oldArr = [...updatedUser.recentProjects]

        const arr = oldArr.filter(p => p._id !== params.projectid)
        arr.push({ _id: params.projectid, name: projectContext.project.name })

        if (arr.length > 3) {
            arr.shift()
        }

        updatedUser.recentProjects = arr

        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/user/recentProjects/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }, body: JSON.stringify({
                recentProjects: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            context.setUser(updatedUser)
        }
    }, [context, history, params.projectid, projectContext.project])

    useEffect(() => {
        if (!projectContext.project || projectContext.project._id !== params.projectid) {
            return
        } else {
            updateUserRecentProjects()
        }
    }, [params.projectid, projectContext.project])


    if (!projectContext.project || projectContext.project._id !== params.projectid) {
        return (
            <PageLayout>
                <Loader
                    type="TailSpin"
                    color="#363338"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
            </PageLayout>
        )
    }








    async function handleOnDragEnd(result) {
        if (!result.destination) return

        if (result.type === 'droppableItem') {
            let position = result.destination.index

            const filteredList = projectContext.lists.filter(element => !(projectContext.hiddenLists.includes(element._id)))
            const previousId = filteredList[position - 1]
            position = projectContext.lists.indexOf(previousId) + 1

            // console.log(filteredList, position);

            // const newListsArr = [...lists]
            // const [reorderedList] = newListsArr.splice(result.source.index, 1)
            // newListsArr.splice(result.destination.index, 0, reorderedList)
            // setLists(newListsArr)

            const token = getCookie("x-auth-token")
            const response = await fetch(`/api/projects/lists/${projectContext.project._id}/${result.draggableId}/dnd-update`, {
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
            }
        }

        if (result.type === 'droppableSubItem') {
            const position = result.destination.index
            const source = result.source.droppableId
            const destination = result.destination.droppableId
            const token = getCookie("x-auth-token")
            const response = await fetch(`/api/projects/lists/${projectContext.project._id}/${result.draggableId}/dnd-update`, {
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
        socket.emit('project-update', projectContext.project)
        socket.emit('task-team-update', teamId)
    }

    const addList = async (e) => {
        e.preventDefault()

        if (listName === "") {
            return
        }
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/${projectContext.project._id}`, {
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
            setIsActive(!isActive)
            setListName('')
            socket.emit('project-update', projectContext.project)
        }

    }



    return (
        <PageLayout>

            {
                isVisible &&
                < div >
                    <Transparent hideForm={() => setIsVisible(!isVisible)} >
                        <EditCard
                            hideForm={() => setIsVisible(!isVisible)}
                            card={currCard}
                            listId={currList}
                            project={projectContext.project}
                            teamId={teamId}
                        />
                    </Transparent >
                </div >
            }
            {
                isVisibleEditList &&
                < div >
                    <Transparent hideForm={() => setIsVisibleEditList(!isVisibleEditList)} >
                        <EditList hideForm={() => setIsVisibleEditList(!isVisibleEditList)} list={currList} project={projectContext.project} />
                    </Transparent >
                </div >
            }
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='droppable' direction='horizontal' type='droppableItem'>
                    {(provided) => (
                        <div className={styles.flex} ref={provided.innerRef} >
                            {
                                projectContext.lists
                                    .filter(element => !(projectContext.hiddenLists.includes(element._id)))
                                    .map((element, index) => {
                                        return (
                                            <Draggable key={element._id} draggableId={element._id} index={index}>
                                                {(provided) => (
                                                    <div>
                                                        <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                            <List list={element} project={projectContext.project} isAdmin={isAdmin}
                                                                showEditList={() => {
                                                                    setCurrList(element._id)
                                                                    setIsVisibleEditList(!isVisibleEditList)
                                                                }}
                                                                showCurrentCard={(card) => {
                                                                    setCurrCard(card);
                                                                    setCurrList(element._id);
                                                                    setIsVisible(!isVisible)
                                                                }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    })
                            }
                            {
                                isAdmin &&
                                <div className={styles.list} >
                                    {
                                        isActive ?
                                            <form ref={listRef} className={styles.container} >
                                                <input className={styles.input} type={'text'} value={listName} onChange={e => setListName(e.target.value)} />
                                                <ButtonClean type='submit' className={styles.addlist} onClick={addList} title='+ Add List' />
                                            </form> : <ButtonClean className={styles.addlist} onClick={() => setIsActive(!isActive)} title='+ Add List' />
                                    }

                                </div>
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <button className={styles.navigateButtons} onClick={() => setIsVisibleEdit(!IsVisibleEdit)} >View Project</button>

            {
                IsVisibleEdit &&
                < div >
                    <Transparent hideForm={() => setIsVisibleEdit(!IsVisibleEdit)} >
                        <EditProject hideForm={() => setIsVisibleEdit(!IsVisibleEdit)} project={projectContext.project} members={members} />
                    </Transparent >
                </div >
            }

            <img className={styles.pic} src={pic} alt="" width="373" height="312" />
        </PageLayout>
    )
}
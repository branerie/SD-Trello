import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import List from '../../components/List'
import PageLayout from '../../components/PageLayout'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import styles from './index.module.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import pic from '../../images/pic.svg'
import ProjectContext from '../../contexts/ProjectContext'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import Loader from 'react-loader-spinner'
import ButtonClean from '../../components/ButtonClean'
import UserContext from '../../contexts/UserContext'
import userObject from '../../utils/userObject'
import useUpdateUserLastTeam from '../../utils/useUpdateUserLastTeam'
import useListsServices from '../../services/useListsServices'

export default function ProjectBoard() {
    const params = useParams()
    const history = useHistory()
    const [listName, setListName] = useState('')
    const listRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(listRef)
    const socket = useSocket()
    const projectContext = useContext(ProjectContext)
    const [isAdmin, setIsAdmin] = useState(false)
    const [dndActive, setDndActive] = useState(false)
    const [isDragListDisabled, setIsDragListDisabled] = useState(false)
    const context = useContext(UserContext)
    const teamId = params.teamid
    const token = getCookie('x-auth-token')
    const { createList, dragAndDropList, dragAndDropCard } = useListsServices()

    useUpdateUserLastTeam(params.teamid)

    const projectUpdate = useCallback((project) => {
        projectContext.setProject(project)
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

        if (dndActive) return

        const memberArr = []
        projectContext.project.membersRoles.map(element => {
            return memberArr.push({ admin: element.admin, username: element.memberId.username, id: element.memberId._id })

        })
        projectContext.setLists(projectContext.project.lists)
        const member = memberArr.find(m => m.id === context.user.id)

        if (member) {
            setIsAdmin(member.admin)
        }

    }, [projectContext.project, params.projectid, projectContext, context.user.id, dndActive])

    const updateUserRecentProjects = useCallback(async () => {
        const userId = context.user.id
        let updatedUser = { ...context.user }
        let oldArr = [...updatedUser.recentProjects]

        if (oldArr.length > 2 && oldArr[2]._id === params.projectid) return

        const arr = oldArr.filter(p => p._id !== params.projectid)
        arr.push({ _id: params.projectid, name: projectContext.project.name })

        if (arr.length > 3) {
            arr.shift()
        }

        const response = await fetch(`/api/user/recentProjects/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }, body: JSON.stringify({
                recentProjects: arr
            })
        })
        if (!response.ok) {
            history.push('/error')
        } else {
            const data = await response.json()
            const user = userObject(data)
            context.logIn(user)
        }
    }, [context, history, params.projectid, projectContext.project, token])

    useEffect(() => {
        if (!projectContext.project || projectContext.project._id !== params.projectid) {
            return
        } else {
            updateUserRecentProjects()
        }
    }, [params.projectid, projectContext.project, updateUserRecentProjects])

    if (!projectContext.project || projectContext.project._id !== params.projectid) {
        return (
            <PageLayout>
                <Loader
                    type='TailSpin'
                    color='#363338'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
            </PageLayout>
        )
    }

    async function handleOnDragEnd(result) {
        if (!result.destination) return

        setDndActive(true)

        if (result.type === 'droppableItem') {
            let position = result.destination.index

            const filteredList = projectContext.lists.filter(element => !(projectContext.hiddenLists.includes(element._id)))
            const previousId = filteredList[position - 1]
            position = projectContext.lists.indexOf(previousId) + 1

            const newListsArr = [...projectContext.lists]
            const [reorderedList] = newListsArr.splice(result.source.index, 1)
            newListsArr.splice(result.destination.index, 0, reorderedList)
            projectContext.setLists(newListsArr)

            const updatedProject = await dragAndDropList(projectContext.project._id, result.draggableId, position)
            projectContext.setProject(updatedProject)
        }

        if (result.type === 'droppableSubItem') {
            const position = result.destination.index
            const oldPosition = result.source.index
            const source = result.source.droppableId
            const destination = result.destination.droppableId

            const newListsArr = [...projectContext.lists]
            let sourcePosition = ''
            let destinationPosition = ''

            for (let list of newListsArr) {
                if (list._id === source) sourcePosition = newListsArr.indexOf(list)
                if (list._id === destination) destinationPosition = newListsArr.indexOf(list)
            }

            const [task] = newListsArr[sourcePosition].cards.splice(oldPosition, 1)
            newListsArr[destinationPosition].cards.splice(position, 0, task)
            projectContext.setLists(newListsArr)

            await dragAndDropCard(projectContext.project._id, result.draggableId, position, source, destination)
        }

        socket.emit('project-update', projectContext.project)
        socket.emit('task-team-update', teamId)
        setDndActive(false)
    }

    const addList = async (e) => {
        e.preventDefault()

        if (listName === '') {
            return
        }

        await createList(projectContext.project._id, listName)
        setIsActive(!isActive)
        setListName('')
        socket.emit('project-update', projectContext.project)
    }

    return (
        <PageLayout>
            <div style={{ position: 'absolute' }}>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='droppable' direction='horizontal' type='droppableItem'>
                        {(provided) => (
                            <div className={styles['container-droppable']} ref={provided.innerRef} >
                                {projectContext.lists
                                    .filter(element => !(projectContext.hiddenLists.includes(element._id)))
                                    .map((element, index) => {
                                        return (
                                            <Draggable
                                                key={element._id}
                                                draggableId={element._id}
                                                index={index}
                                                isDragDisabled={isDragListDisabled ? true : false}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className={styles.droppable}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <List
                                                            list={element}
                                                            project={projectContext.project}
                                                            isAdmin={isAdmin}
                                                            setIsDragListDisabled={setIsDragListDisabled}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    })
                                }
                                {provided.placeholder}
                                {isAdmin &&
                                    <div className={styles.list} >
                                        {isActive ?
                                            <form ref={listRef} className={styles.container} >
                                                <input
                                                    autoFocus
                                                    className={styles.input}
                                                    type={'text'}
                                                    value={listName}
                                                    onChange={e => setListName(e.target.value)}
                                                />
                                                <ButtonClean type='submit' className={styles.addlist} onClick={addList} title='+ Add List' />
                                            </form> : <ButtonClean className={styles.addlist} onClick={() => setIsActive(!isActive)} title='+ Add List' />
                                        }
                                    </div>
                                }
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <img className={styles.pic} src={pic} alt='' width='340' />
            </div>
        </PageLayout>
    )
}
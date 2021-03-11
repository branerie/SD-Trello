import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import Loader from 'react-loader-spinner'
import { useSocket } from '../../contexts/SocketProvider'
import UserContext from '../../contexts/UserContext'
import ProjectContext from '../../contexts/ProjectContext'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import List from '../../components/List'
import projectBoardPic from '../../images/project-board.svg'
import userObject from '../../utils/userObject'
import useUpdateUserLastTeam from '../../utils/useUpdateUserLastTeam'
import useListsServices from '../../services/useListsServices'
import AddProjectBoardList from '../../components/AddProjectBoardList'
import useUserServices from '../../services/useUserServices'

const ProjectBoard = () => {
    const params = useParams()
    const teamId = params.teamid
    const socket = useSocket()
    const context = useContext(UserContext)
    const projectContext = useContext(ProjectContext)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isDndActive, setIsDndActive] = useState(false)
    const [isDragListDisabled, setIsDragListDisabled] = useState(false)
    const { dragAndDropList, dragAndDropCard } = useListsServices()
    const { updateRecentProjects } = useUserServices()

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

    const updateUserRecentProjects = useCallback(async () => {
        const userId = context.user.id
        let updatedUser = { ...context.user }
        let oldProjects = [...updatedUser.recentProjects]

        if (oldProjects.length > 2 && oldProjects[2]._id === params.projectid) return

        const newProjects = oldProjects.filter(p => p._id !== params.projectid)
        newProjects.push({ _id: params.projectid, name: projectContext.project.name })

        if (newProjects.length > 3) newProjects.shift()

        const data = await updateRecentProjects(userId, newProjects)
        const user = userObject(data)
        context.logIn(user)
    }, [context, params.projectid, projectContext.project, updateRecentProjects])

    useEffect(() => {
        if (!projectContext.project || projectContext.project._id !== params.projectid) return

        updateUserRecentProjects()

        if (isDndActive) return

        const memberArr = []
        projectContext.project.membersRoles.map(element => {
            return memberArr.push({ admin: element.admin, username: element.memberId.username, id: element.memberId._id })
        })

        projectContext.setLists(projectContext.project.lists)
        const member = memberArr.find(m => m.id === context.user.id)

        if (member) setIsAdmin(member.admin)

    }, [updateUserRecentProjects, projectContext.project, params.projectid, projectContext, context.user.id, isDndActive])

    const dndList = async (result) => {
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

    const dndCard = async (result) => {
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

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return

        setIsDndActive(true)

        if (result.type === 'droppableItem') {
            await dndList(result)
        }

        if (result.type === 'droppableSubItem') {
            await dndCard(result)
        }

        socket.emit('project-update', projectContext.project)
        socket.emit('task-team-update', teamId)
        setIsDndActive(false)
    }

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

    return (
        <PageLayout>
            <div className={styles.container}>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='droppable' direction='horizontal' type='droppableItem'>
                        {(provided) => (
                            <div className={styles['container-droppable']} ref={provided.innerRef} >
                                { projectContext.lists
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
                                                        className={styles.draggable}
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
                                { isAdmin && <AddProjectBoardList />}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <img className={styles.pic} src={projectBoardPic} alt='' width='340' />
            </div>
        </PageLayout>
    )
}

export default ProjectBoard
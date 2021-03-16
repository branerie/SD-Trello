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
import useUpdateUserLastTeam from '../../utils/useUpdateUserLastTeam'
import useListsServices from '../../services/useListsServices'
import AddProjectBoardList from '../../components/AddProjectBoardList'
import useUserServices from '../../services/useUserServices'
import checkIsUserAdmin from '../../utils/checkIsUserAdmin'

const ProjectBoard = () => {
    const socket = useSocket()
    const { user, logIn } = useContext(UserContext)
    const { project, lists, hiddenLists, setProject, setLists } = useContext(ProjectContext)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isDndActive, setIsDndActive] = useState(false)
    const [isDragListDisabled, setIsDragListDisabled] = useState(false)
    const { dragAndDropList, dragAndDropCard } = useListsServices()
    const { updateRecentProjects } = useUserServices()

    const { teamid: teamId, projectid: projectId } = useParams()
    useUpdateUserLastTeam(teamId)

    const projectUpdate = useCallback((project) => {
        setProject(project)
        setLists(project.lists)
    }, [setProject, setLists])

    useEffect(() => {
        const id = projectId

        if (socket == null) return

        socket.on('project-updated', projectUpdate)

        socket.emit('project-join', id)
        return () => socket.off('project-updated')
    }, [socket, projectUpdate, projectId])

    const updateUserRecentProjects = useCallback(async () => {
        const updatedUser = { ...user }
        const recentProjects = [...updatedUser.recentProjects]

        // Returns if the last project id from recent projects array is equal to current projectId
        if (recentProjects.length > 0 && recentProjects[recentProjects.length - 1]._id === projectId) return

        const newRecentProjects = recentProjects.filter(p => p._id !== projectId)
        newRecentProjects.push({ _id: projectId, name: project.name })

        // Removing the oldest project if recent projects are more than 3
        if (newRecentProjects.length > 3) {
            newRecentProjects.shift()
        }

        const data = await updateRecentProjects(user.id, newRecentProjects)
        logIn(data)
    }, [projectId, project, updateRecentProjects, logIn, user])

    useEffect(() => {
        if (!project || project._id !== projectId) return

        updateUserRecentProjects()

        if (isDndActive) return

        setLists(project.lists)

        setIsAdmin(checkIsUserAdmin(user.id, project.membersRoles))

    }, [updateUserRecentProjects, project, projectId, user.id, isDndActive, setLists])

    const handleDragAndDropList = async (result) => {
        let position = result.destination.index

        const filteredList = lists.filter(element => !(hiddenLists.includes(element._id)))
        const previousId = filteredList[position - 1]
        position = lists.indexOf(previousId) + 1

        const newListsArr = [...lists]
        const [reorderedList] = newListsArr.splice(result.source.index, 1)
        newListsArr.splice(result.destination.index, 0, reorderedList)
        setLists(newListsArr)

        const updatedProject = await dragAndDropList(project._id, result.draggableId, position)
        setProject(updatedProject)
    }

    const handleDragAndDropCard = async (result) => {
        const position = result.destination.index
        const oldPosition = result.source.index
        const source = result.source.droppableId
        const destination = result.destination.droppableId

        const newListsArr = [...lists]

        const sourcePosition = newListsArr.findIndex(list => list._id === source)
        const destinationPosition = newListsArr.findIndex(list => list._id === destination)

        const [task] = newListsArr[sourcePosition].cards.splice(oldPosition, 1)
        newListsArr[destinationPosition].cards.splice(position, 0, task)
        setLists(newListsArr)

        await dragAndDropCard(project._id, result.draggableId, position, source, destination)
    }

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return

        setIsDndActive(true)

        if (result.type === 'droppableItem') {
            await handleDragAndDropList(result)
        }

        if (result.type === 'droppableSubItem') {
            await handleDragAndDropCard(result)
        }

        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
        setIsDndActive(false)
    }

    return (
        <PageLayout>
            <div className={styles.container}>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='droppable' direction='horizontal' type='droppableItem'>
                        {(provided) => (
                            <div className={styles['container-droppable']} ref={provided.innerRef} >
                                { !project || project._id !== projectId ?
                                    <Loader
                                        type='TailSpin'
                                        color='#363338'
                                        height={100}
                                        width={100}
                                        timeout={3000} //3 secs
                                    />
                                    :
                                    <>{lists
                                        .filter(element => !(hiddenLists.includes(element._id)))
                                        .map((element, index) => {
                                            return (<Draggable
                                                key={element._id}
                                                draggableId={element._id}
                                                index={index}
                                                isDragDisabled={isDragListDisabled}
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
                                                            project={project}
                                                            isAdmin={isAdmin}
                                                            setIsDragListDisabled={setIsDragListDisabled}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>)
                                        })
                                    }</>
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
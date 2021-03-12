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
    /* REVIEW: В общия случай практиката е променливи да се дефинират възможно най-близко в кода до първия ред, на който
       се използват. 
       Има изключения - константи глобални за файла, например, се пишат най-отгоре всичките. Хуковете на реакт се дефинират 
       всичките най-отгоре (това е главно защото винаги трябва да се викат в един и същи ред - да не зависи реда им на 
       извикване от някой if или някой цикъл, но и за да е по-подредено). Аз понякога групирам дефинирането на някои 
       променливи заедно, макар че едната не се използва веднага, ако са логически свързани. В случая по-добре teamId да се 
       дефинира точно преди хука useUpdateUserLastTerm и да се използва там, вместо пак params.teamid. Още по-добре, да се 
       премести useParams точно над useUpdateUserLastTerm и да се извика така:
            const { teamid: teamId, projectid: projectId } = useParams()
        И надолу да се използват директно teamId и projectId. Направо самите params може да са кръстени с camelCase, за да
        не се налага да се преименуват тук */
    const teamId = params.teamid
    const socket = useSocket()
    /* REVIEW: Отдолу за другия контекст написах обяснение защо е добре да се деструктурират.
            const { user, logIn } = useContext(UserContext) */
    const context = useContext(UserContext)
    /* REVIEW: Според мен по-добре да се деструктурира каквото ти трябва от даден контекст. В случая:
            const { project, lists, hiddenLists, setProject, setLists } = useContext(ProjectContext)
        Едно че се съкращава използването им, второ че като dependency-та на useCallback/useEffect може да се слагат
        конкретните методи/променливи, при които реално трябва да се ъпдейтне. Ако целия projectContext е вкаран като
        зависимост, всяка промяна на контекста ще предизвиква промянва в callback/effect-a, дори да няма нищо общо с него. */
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
        /* REVIEW: Не става ведната ясно защо return-ва функцията при length > 2 и защо сравняваш индекс 2 с params.projectid. 
           Двата варианта са да се напише коментар, който обяснява този if, или двойката да се изведе като константа с име от
           което се разбира защо точно 2 използваме */
        if (oldProjects.length > 2 && oldProjects[2]._id === params.projectid) return

        const newProjects = oldProjects.filter(p => p._id !== params.projectid)
        newProjects.push({ _id: params.projectid, name: projectContext.project.name })
        /* REVIEW: Същото като с двойката по-нагоре. Не става ясно защо shift при length > 3 */
        if (newProjects.length > 3) newProjects.shift()

        const data = await updateRecentProjects(userId, newProjects)
        /* REVIEW: userObject не е добро име за функция. Най-малкото може да е getUserObject, но ако се сетиш за нещо
           по-описателно за какво точно от user-a връща тази функция, по-добре */
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
    /* Не се разбира какво точно прави тази функция от името - дали връща някакъв лист, дали го съставя просто, дали го трие...
       Ако трябва някой да променя компонента, трябва да отдели време да и разглежда кода */
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
    /* REVIEW: Същото като с dndList */
    const dndCard = async (result) => {
        const position = result.destination.index
        const oldPosition = result.source.index
        const source = result.source.droppableId
        const destination = result.destination.droppableId

        const newListsArr = [...projectContext.lists]
        let sourcePosition = ''
        let destinationPosition = ''

        for (let list of newListsArr) {
            /* REVIEW: Използвайте if на един ред само ако не връща нищо или връща null. Повече от това се чете трудно */
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
            /* REVIEW: Реакт работи така, че като пререндеросва страницата, започва да сравнява компонент/таг по 
               компонент/таг и реално пререндеросва само там, където има разлики. В случая, тъй като и в двата случая
               (ако се изпълни този if и ако не) се използва PageLayout, е по-добре това условие да се проверява вътре 
               в него. Така няма да се пререндеросва самия PageLayout. Може да се помисли и ако може да се сложи if
               проверката още по-навътре в структурата, още по-добре. Да се спести прендеросването на повече компоненти. */
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
                                                /* REVIEW: Самата isDragListDisabled е булева променлива. Може да се
                                                   подаде директно тя, няма нужда от ternary operator */
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
import React, { useState, useMemo, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import TaskMembers from '../EditCardOptions/TaskMembers'
import TaskDueDate from '../EditCardOptions/TaskDueDate'
import TaskHistory from '../EditCardOptions/TaskHistory'
import TaskProgress from '../EditCardOptions/TaskProgress'
import TaskAttach from '../EditCardOptions/TaskAttach'
import ResponsiveTextArea from '../Inputs/ResponsiveTextarea'
import TaskDelete from '../EditCardOptions/TaskDelete'
import taskNamePic from '../../images/edit-card/task-name.svg'
import useCardsServices from '../../services/useCardsServices'

const EditCard = ({ listId, card, project, teamId, hideForm }) => {
    const socket = useSocket()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [taskHistory, setTaskHistory] = useState(null)
    const { editTask } = useCardsServices()

    const dueDate = useMemo(() => {
        let date = new Date(card.dueDate)

        if (!card.dueDate) {
            date = null
        }
        
        return date
    }, [card.dueDate])

    useEffect(() => {
        setName(card.name)
        setDescription(card.description)
        setTaskHistory(card.history)
    }, [card])

    const handleSubmit = async () => {
        const editedFields = { name, description }
        await editTask(listId, card._id, editedFields)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }

    return (
        <div className={styles.container}>

            <div className={styles['task-name']}>
                <span>
                    <img src={taskNamePic} alt='taskNamePic' />
                </span>
                <ResponsiveTextArea
                    value={name}
                    setValue={setName}
                    className={`${styles['name-input']} ${styles.text}`}
                    autoFocus={false}
                    onSubmit={handleSubmit}
                    onBlur={handleSubmit}
                />
            </div>

            <div className={styles['task-body']} >
                <div className={styles['left-side']}>
                    <div>
                        <div className={styles.text}>Description</div>
                        <ResponsiveTextArea
                            value={description}
                            setValue={setDescription}
                            className={styles['description-input']}
                            autoFocus={false}
                            onSubmit={handleSubmit}
                            onBlur={handleSubmit}
                        />
                    </div>
                    <div className={styles['task-component']}>
                        <div className={styles.text}>History</div>
                        <TaskHistory taskHistory={taskHistory} />
                    </div>
                </div>

                <div className={styles['right-side']}>
                    <div className={styles['task-component']}>
                        <div className={styles.text}>Manage</div>
                        <TaskDueDate
                            dueDate={dueDate}
                            card={card}
                            listId={listId}
                            project={project}
                            teamId={teamId}
                        />
                        <TaskMembers
                            card={card}
                            listId={listId}
                            project={project}
                            teamId={teamId}
                        />
                        <TaskProgress
                            card={card}
                            listId={listId}
                            project={project}
                            teamId={teamId}
                            taskHistory={taskHistory}
                            setTaskHistory={setTaskHistory}
                        />
                        <TaskAttach
                            card={card}
                            project={project}
                            teamId={teamId}
                        />
                        <TaskDelete
                            cardId={card._id}
                            listId={listId}
                            project={project}
                            teamId={teamId}
                            hideForm={hideForm}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCard
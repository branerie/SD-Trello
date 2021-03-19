import React, { useState } from 'react'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import ProjectBoardInput from '../Inputs/ProjectBoardInput'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import useCardsServices from '../../services/useCardsServices'

const AddProjectBoardTask = ({ project, listId }) => {
    const socket = useSocket()
    const [taskName, setTaskName] = useState('')
    const [isAddTaskVisible, setIsAddTaskVisible, cardRef] = useDetectOutsideClick()
    const { createTask } = useCardsServices()

    const addTask = async () => {
        if (taskName === '') {
            setIsAddTaskVisible(false)
            return
        }

        await createTask(listId, taskName)
        setIsAddTaskVisible(false)
        setTaskName('')
        socket.emit('project-update', project)
    }

    return (
        <div className={styles.task} >
            {isAddTaskVisible ?
                <div ref={cardRef} className={styles.container} >
                    <ProjectBoardInput
                        value={taskName}
                        setValue={setTaskName}
                        onEnter={addTask}
                        onEscape={() => setIsAddTaskVisible(false)}
                    />
                    <ButtonClean
                        className={styles.button}
                        onClick={addTask}
                        title='+ Add Task'
                    />
                </div>
                :
                <ButtonClean
                    className={styles.button}
                    onClick={() => setIsAddTaskVisible(true)}
                    title='+ Add Task'
                />
            }
        </div>
    )
}

export default AddProjectBoardTask

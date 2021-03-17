import React, { useState } from 'react'
import commonStyles from '../index.module.css'
import ConfirmDialog from '../../ConfirmationDialog'
import deletePic from '../../../images/edit-card/delete.svg'
import { useSocket } from '../../../contexts/SocketProvider'
import useCardsServices from '../../../services/useCardsServices'

const TaskDelete = ({ cardId, listId, project, teamId, hideForm }) => {
    const socket = useSocket()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { deleteTask } = useCardsServices()

    const handleDeleteTask = async () => {
        await deleteTask(listId, cardId)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
        hideForm()
    }

    return (
        <div>
            <button
                className={commonStyles['small-buttons']}
                onClick={() => setIsConfirmOpen(true)}
            >
                <img className={commonStyles.pics} src={deletePic} alt='deletePic' />
                Delete Task
            </button>
            {isConfirmOpen &&
                <ConfirmDialog
                    title={'delete this task'}
                    hideConfirm={() => setIsConfirmOpen(false)}
                    onConfirm={handleDeleteTask}
                />
            }
        </div>
    )
}

export default TaskDelete

import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { useSocket } from '../../../contexts/SocketProvider'
import commonStyles from '../index.module.css'
import styles from './index.module.css'
import dueDatePic from '../../../images/edit-card/due-date.svg'
import { formatDate } from '../../../utils/date'
import useCardsServices from '../../../services/useCardsServices'

const TaskDueDate = ({ dueDate, card, listId, project, teamId }) => {
    const socket = useSocket()
    const [taskDueDate, setTaskDueDate] = useState(null)
    const [formatedDueDate, setFormatedDueDate] = useState(null)
    const [windowWidth, setWindowWidth] = useState(0)
    const { editTask } = useCardsServices()
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    useEffect(() => {
        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    const updateDimensions = () => {
        setWindowWidth(window.innerWidth)
    }

    const datePickerPosition = (w) => {
        if (w > 750) {
            return 'bottom-end'
        }

        return 'bottom-start'
    }

    useEffect(() => {
        setTaskDueDate(dueDate)
        if (taskDueDate) {
            // taskDueDate.getTime() returns the number of milliseconds since the Unix Epoch (1 January 1970)
            const date = taskDueDate.getTime() ? formatDate(taskDueDate, '%d-%m-%Y') : ''
            setFormatedDueDate(date)
        }
    }, [dueDate, taskDueDate])

    const updateProjectSocket = () => {
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }

    const editCardDueDate = async (date) => {
        if (taskDueDate === '' && date === '') {
            console.log('return');
            return
        }

        const editedFields = { dueDate: date }

        await editTask(listId, card._id, editedFields)
        updateProjectSocket()
    }

    return (
        <div>
            <DatePicker
                customInput={
                    <div className={commonStyles['small-buttons']} >
                        <img className={commonStyles.pics} src={dueDatePic} alt='' />
                        Due Date
                    </div>
                }
                selected={formatedDueDate ? taskDueDate : today}
                onChange={(date) => {
                    setTaskDueDate(date)
                    editCardDueDate(date)
                }}
                label='Go to date'
                popperPlacement={datePickerPosition(windowWidth)}
            />
            { formatedDueDate && <div className={styles.date}>{formatedDueDate}</div>}
        </div>
    )
}

export default TaskDueDate
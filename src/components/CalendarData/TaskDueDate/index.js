import React, { useCallback, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useSocket } from '../../../contexts/SocketProvider'
import styles from './index.module.css'
import Transparent from '../../Transparent'
import EditCard from '../../EditCard'
import pen from '../../../images/pen.svg'
import useCardsServices from '../../../services/useCardsServices'

const TaskDueDate = ({ dueDate, formatedDueDate, card, listId, project, teamId }) => {
    const [isActive, setIsActive] = useState(false)
    const [cardDueDate, setCardDueDate] = useState(dueDate)
    const [isVisible, setIsVisible] = useState(false)
    const socket = useSocket()
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const { editTask } = useCardsServices()

    const editCardDueDate = useCallback(async (date) => {
        if (cardDueDate === '' && date === '') {
            return
        }

        const editedFields = { dueDate: date }
        await editTask(listId, card._id, editedFields)

        setIsActive(!isActive)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)

    }, [editTask, cardDueDate, setIsActive, isActive, card._id, listId, project, socket, teamId])

    const changeCardDueDate = (date) => {
        setCardDueDate(date)
        editCardDueDate(date)
    }

    return (
        <span className={styles.container}>
            <DatePicker
                selected={formatedDueDate ? cardDueDate : today}
                customInput={
                    formatedDueDate
                        ? <div className={styles['formated-date']}>
                            <span>{formatedDueDate}</span>
                        </div>
                        : <span>Select date</span>
                }
                onChange={changeCardDueDate}
                label='Go to date'
                onBlur={formatedDueDate ? () => setIsActive(!isActive) : null}
                popperPlacement='bottom-end'
                closeOnScroll={e => e.target === document.getElementsByClassName('rt-tbody')[0]}
            />

            { isVisible ?
                < span >
                    <Transparent hideForm={() => setIsVisible(!isVisible)} >
                        <EditCard
                            hideForm={() => setIsVisible(!isVisible)}
                            card={card}
                            listId={listId}
                            project={project}
                            teamId={teamId}
                        />
                    </Transparent >
                </span >
                :
                <span>
                    <img
                        className={styles.pen}
                        src={pen}
                        alt=''
                        width='13'
                        onClick={() => setIsVisible(true)}
                    />
                </span>
            }
        </span>
    )

}

export default TaskDueDate
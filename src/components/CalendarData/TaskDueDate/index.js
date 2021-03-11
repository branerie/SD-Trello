import React, { useCallback, useState } from 'react'
import commonStyles from '../index.module.css'
import { useParams } from 'react-router-dom'
import { useSocket } from '../../../contexts/SocketProvider'
import pen from '../../../images/pen.svg'
import DatePicker from 'react-datepicker'
import Transparent from '../../Transparent'
import EditCard from '../../EditCard'
import useCardsServices from '../../../services/useCardsServices'

export default function TaskDueDate(props) {
    const [isActive, setIsActive] = useState(false)
    const [cardDueDate, setCardDueDate] = useState(props.cardDueDate)
    const [isVisible, setIsVisible] = useState(false)
    const socket = useSocket()
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    const params = useParams()
    const teamId = params.teamid
    const { editTask } = useCardsServices()

    const editCardDueDate = useCallback(async (date) => {
        let cardId = props.cardId
        let listId = props.listId

        if (cardDueDate === '' && date === '') {
            console.log('return');
            return
        }

        const editedFields = { dueDate: date }
        await editTask(listId, cardId, editedFields)

        setIsActive(!isActive)
        socket.emit('project-update', props.project)
        socket.emit('task-team-update', props.teamId)

    }, [editTask, cardDueDate, setIsActive, isActive, props.cardId, props.listId, props.project, socket, props.teamId])

    const changeCardDueDate = (date) => {
        setCardDueDate(date)
        editCardDueDate(date)
    }

    const value = props.value

    return (
        <span className={commonStyles.dueDateField}>
            <DatePicker
                selected={value ? cardDueDate : today}
                customInput={
                    value
                    ?   <div className={commonStyles.dueDateFieldInput}>
                            <span>{value}</span>
                        </div>
                        : <span>Select date</span>
                }
                onChange={changeCardDueDate}
                label='Go to date'
                onBlur={value ? () => setIsActive(!isActive) : null}
                popperPlacement='bottom-end'
                closeOnScroll={e => e.target === document.getElementsByClassName('rt-tbody')[0]}
            />

            { isVisible ?
                < span >
                    <Transparent hideForm={() => setIsVisible(!isVisible)} >
                        <EditCard
                            hideForm={() => setIsVisible(!isVisible)}
                            initialCard={props.card}
                            listId={props.listId}
                            project={props.project}
                            teamId={teamId}
                        />
                    </Transparent >
                </span >
                :
                <span>
                    <img 
                        className={commonStyles.pen} 
                        src={pen} 
                        alt='...' 
                        width='13' 
                        height='13' 
                        onClick={() => setIsVisible(true)} 
                    />
                </span>
            }
        </span>
    )

}


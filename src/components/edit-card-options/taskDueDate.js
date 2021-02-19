import React, { useCallback, useState, useEffect } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import DatePicker from "react-datepicker"
import { formatDate } from '../../utils/date'
import pic5 from '../../images/edit-card/pic5.svg'



export default function TaskDueDate({ dueDate, card, listId, project, teamId, setCurrCard }) {

    const [cardDueDate, setCardDueDate] = useState(null)
    const [taskDueDate, setTaskDueDate] = useState(null)
    const [width, setWindowWidth] = useState(0)
    const history = useHistory()
    const socket = useSocket()
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())


    useEffect( () => {
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }, [])
  
    const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

    function datePickerPosition(w) {
        if (w > 750) {
            return 'bottom-end'
        } else {
            return 'bottom-start'
        }
    }

    useEffect(() => {
        setCardDueDate(dueDate)
        if (cardDueDate) {
            const date = cardDueDate.getTime() ? formatDate(cardDueDate, '%d-%m-%Y') : ''
            setTaskDueDate(date)
        }
    }, [dueDate, cardDueDate])

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }, [socket, project, teamId])

    const editCardDueDate = async (date) => {

        if (cardDueDate === "" && date === '') {
            console.log('return');
            return
        }
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${listId}/${card._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                dueDate: date,
                teamId: teamId
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const updatedCard = await response.json()
            if (setCurrCard) setCurrCard(updatedCard)
            updateProjectSocket()
        }
    }

    return (
        <div>
            <DatePicker
                customInput={
                    <div className={styles['small-buttons']} >
                        <img className={styles.pics} src={pic5} alt="pic5" />
                        Due Date
                    </div>
                }
                selected={taskDueDate ? cardDueDate : today}
                onChange={(date) => { setCardDueDate(date); editCardDueDate(date) }}
                label="Go to date"
                popperPlacement={datePickerPosition(width)}
            />
            {
                taskDueDate && <div className={styles.date}>{taskDueDate}</div>
            }
        </div>
    )
}





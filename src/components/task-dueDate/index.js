import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import DatePicker from "react-datepicker"



export default function TaskDueDate(props) {


    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [cardDueDate, setCardDueDate] = useState(props.cardDueDate)

 
    const history = useHistory()
    const socket = useSocket()

    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())


    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])
     



    const editCardDueDate = useCallback(async (date) => {

        let cardId = props.cardId
        let listId = props.listId



        if (cardDueDate === "" && date === '') {
            console.log('return');
            return
        }
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                dueDate: date
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            setIsActive(!isActive)
            updateProjectSocket()
        }

    }, [history, cardDueDate, updateProjectSocket, setIsActive, isActive, props.cardId, props.listId
    ])


    let cardDate = ''
    let thisCardDate = ''
    if (cardDueDate) {
        cardDate = new Date(cardDueDate)
        thisCardDate = cardDate.getTime()
    }


    // let value = (thisCardDate !== '' && thisCardDate !== 0) ? ('0' + cardDate.getDate()).slice(-2) + '-' + (cardDate.toLocaleString('default', { month: 'short' })) + '-' + cardDate.getFullYear() : ''

    let value = (thisCardDate !== '' && thisCardDate !== 0) ? ('0' + cardDate.getDate()).slice(-2) + '-' + ('0' + (cardDate.getMonth()+1)).slice(-2) + '-' + cardDate.getFullYear() : ''


    if (value) {

        let taskDueDate = value

        return (
            <span className={styles.dueDateField}>
                <DatePicker
                    selected={cardDueDate}
                    customInput={<div className={styles.dueDateField}>
                        <span>{taskDueDate}</span>
                    </div>}
                    onChange={async (date) => { await setCardDueDate(date); editCardDueDate(date) }}
                    label="Go to date"
                    onBlur={() => setIsActive(!isActive)} />               
            </span>
        )
    }
    else {
        return (
            <span className={styles.dueDateField}>
                {
                    isActive ?
                        <div className={styles.dueDateField}>
                            <DatePicker selected={today} onChange={(date) => { setCardDueDate(date); editCardDueDate(date) }} label="Go to date" />
                        </div>
                        :
                        <div className={styles.dueDateField}>
                            <span onClick={() => setIsActive(!isActive)}>Due Date</span>                           
                        </div>
                }                
            </span>
        )
    }

}



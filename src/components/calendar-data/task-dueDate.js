import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import pen from '../../images/pen.svg'
import DatePicker from "react-datepicker"
import Transparent from "../transparent"
import EditCard from '../edit-card'


export default function TaskDueDate(props) {

    const dropdownRef = useRef(null)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [cardDueDate, setCardDueDate] = useState(props.cardDueDate)
    const [isVisible, setIsVisible] = useState(false)
    const history = useHistory()
    const socket = useSocket()
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    const params = useParams()
    const teamId = params.teamid


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
            socket.emit('project-update', props.project)
            socket.emit('task-team-update', props.teamId)
        }

    }, [history, cardDueDate, setIsActive, isActive, props.cardId, props.listId, props.project, socket, props.teamId])

    const changeCardDueDate = (date) => {
        setCardDueDate(date)
        editCardDueDate(date)
    } 

    const value = props.value

    return (
        <span className={styles.dueDateField}>
            <DatePicker
                selected={value ? cardDueDate : today}
                customInput={
                    value
                    ?   <div className={styles.dueDateFieldInput}>
                            <span>{value}</span>
                        </div>
                    :   <span>Select date</span>
                }
                onChange={changeCardDueDate}
                label="Go to date"
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
                        className={styles.pen} 
                        src={pen} 
                        alt="..." 
                        width="13" 
                        height="13" 
                        onClick={() => setIsVisible(true)} 
                    />
                </span>
            }
        </span>
    )

}



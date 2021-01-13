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

    // let cardDate = ''
    // let thisCardDate = ''
    // if (cardDueDate) {
    //     cardDate = new Date(cardDueDate)
    //     thisCardDate = cardDate.getTime()
    // }


    // let value = (thisCardDate !== '' && thisCardDate !== 0) ? ('0' + cardDate.getDate()).slice(-2) + '-' + (cardDate.toLocaleString('default', { month: 'short' })) + '-' + cardDate.getFullYear() : ''

    // let value = (thisCardDate !== '' && thisCardDate !== 0) ? ('0' + cardDate.getDate()).slice(-2) + '-' + ('0' + (cardDate.getMonth()+1)).slice(-2) + '-' + cardDate.getFullYear() : ''

    const value = props.value

    if (value) {

        let taskDueDate = value

        return (
            <span className={styles.dueDateField}>
                <DatePicker
                    selected={cardDueDate}
                    customInput={<div className={styles.dueDateFieldInput}>
                        <span>{taskDueDate}</span>
                    </div>}
                    onChange={async (date) => { await setCardDueDate(date); editCardDueDate(date) }}
                    label="Go to date"
                    onBlur={() => setIsActive(!isActive)} />

                <span>
                    {isVisible ?
                        < span >
                            <Transparent hideForm={() => setIsVisible(!isVisible)} >
                                <EditCard
                                    hideForm={() => setIsVisible(!isVisible)}
                                    card={props.card}
                                    listId={props.listId}
                                    project={props.project}
                                    teamId={teamId}
                                />
                            </Transparent >
                        </span >
                        :
                        <span>
                            <img className={styles.pen} src={pen} alt="..." width="13" height="13" onClick={() => setIsVisible(true)} />
                        </span>
                    }
                </span>


            </span>
        )
    }
    else {
        return (
            <span className={styles.dueDateField}>
                {/* {
                    isActive ? */}
                        <div className={styles.dueDateField}>
                            <DatePicker customInput={<div>
                                <span>Select date</span>
                            </div>}
                                selected={today} onChange={(date) => { setCardDueDate(date); editCardDueDate(date) }} label="Go to date" />
                        </div>
                        {/* :
                        <div className={styles.dueDateField}>
                            <span onClick={() => setIsActive(!isActive)}>Due Date</span>
                        </div>
                } */}

                <span>
                    {isVisible ?
                        < span >
                            <Transparent hideForm={() => setIsVisible(!isVisible)} >
                                <EditCard
                                    hideForm={() => setIsVisible(!isVisible)}
                                    card={props.card}
                                    listId={props.listId}
                                    project={props.project}
                                    teamId={teamId}
                                />
                            </Transparent >
                        </span >
                        :
                        <span>
                            <img className={styles.pen} src={pen} alt="..." width="13" height="13" onClick={() => setIsVisible(true)} />
                        </span>
                    }
                </span>
            </span>
        )
    }

}



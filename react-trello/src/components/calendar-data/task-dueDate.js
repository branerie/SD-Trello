import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';
import pen from '../../images/pen.svg'
import DatePicker from "react-datepicker"




export default function TaskDueDate(props) {


    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
    const [cardDueDate, setCardDueDate] = useState(props.cardDueDate)
    const history = useHistory()
    const socket = useSocket()


    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])



    const editCardDueDate = useCallback(async (date) => {
        // event.preventDefault()

        console.log(cardDueDate);

        // let data = props.value.split('/')
        let cardId = props.cardId
        let listId = props.listId


        if (cardDueDate === "") {
            console.log('return');
            return
        }
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
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

    }, [history, cardDueDate, setCardDueDate, updateProjectSocket])




    let value = props.value

    if (value) {

        let taskDueDate = value
        let cardId = props.cardId
        let listId = props.listId


        return (
            <span>
                {
                    isActive ?
                        // < form ref={dropdownRef} className={styles.container} onSubmit={editCardDueDate} > 
                        <DatePicker selected={cardDueDate} onChange={async (date) => { await setCardDueDate(date); editCardDueDate(date) }} label="Go to date" />
                        //  <button type='submit' className={styles.addlist}>Edit</button>
                        // </form> 
                        :
                        <div>
                            <button className={styles.addlist} onClick={() => setIsActive(!isActive)} >
                                <span>{taskDueDate}</span>
                                {/* <img src={pen} alt="..." width="11.5" height="11.5" /> */}
                            </button>
                        </div>
                }
            </span>
        )
    }
    else {
        return value
    }

}



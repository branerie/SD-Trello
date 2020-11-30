import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';
import pen from '../../images/pen.svg'


export default function TaskProgress(props) {
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
    const [cardProgress, setCardProgress] = useState('')
    const history = useHistory()
    const socket = useSocket()


    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


    const editCardProgress = useCallback(async (event) => {
        event.preventDefault()

        let data = props.value.split('/')
        let cardId = data[1]
        let listId = data[2]


        if (cardProgress === "") {
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
                progress: cardProgress
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            setCardProgress('')
            setIsActive(!isActive)
            updateProjectSocket()
        }

    }, [history, cardProgress, updateProjectSocket])



    function showTaskProgress(value) {
        if (value !== "null") {
            let color = ''
            switch (true) {
                case (value === "100"):
                    color = 'green';
                    break;
                case (value < 20):
                    color = 'red'
                    break;
                case (value < 100):
                    color = 'blue'
                    break;
            }
            return (
                <div style={{ backgroundColor: color }} > {value} %</div>
            )

        }
        return (
            <img src={pen} alt="..." width="11.5" height="11.5" />
        )
    }



    let value = props.value

    if (value) {
        let token = value.split('/')
        if (token.length === 1) {
            return (
                <div className={styles.listName}>{value}</div>
            )
        }
        let taskprogress = token[0]
        let cardId = token[1]
        let listId = token[2]



        return (
            <span>
                {
                    isActive ?
                        < form ref={dropdownRef} className={styles.container} onSubmit={editCardProgress} >
                            <input className={styles.progressInput} type={'text'} placeholder={taskprogress} onChange={e => setCardProgress(e.target.value)} />
                            <button type='submit' className={styles.addlist} cardId={cardId} listId={listId} cardName>Edit</button>
                        </form> :
                        <div className={styles.buttoDiv} >
                            <button className={styles.addlist} onClick={() => setIsActive(!isActive)} >
                                <span>{showTaskProgress(taskprogress)}</span>
                                {/* <img src={pen} alt="..." width="11.5" height="11.5" /> */}

                            </button>
                        </div >
                }
            </span>
        )
    }
    else {
        return showTaskProgress('')
    }

}



import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';
import pen from '../../images/pen.svg'


export default function TaskProgress(props) {
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [cardProgress, setCardProgress] = useState('')
    const [color, setColor] = useState('')

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
        } else if (Number(cardProgress) > 100) {
            setCardProgress(100)
            return
        } else if (Number(cardProgress) < 0) {
            setCardProgress(0)
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

    }, [history, cardProgress, updateProjectSocket, isActive, setIsActive, props.value])



    function showTaskProgress(value) {
        if (value !== "null") {
           

            return (
                <div style={{
                    backgroundColor: getBackGroundColor(value), padding: '5px', fontSize: "14px", border: 'solid black 1px',
                    borderRadius: '5px'
                }} > {value} %</div>
            )

        }
        return (
            <div>
                <img src={pen} alt="..." width="11.5" height="11.5" />
            </div>
        )
    }


    function getBackGroundColor(value) {
        let currColor = ''
        switch (true) {
            case (value === "100"):
                currColor = '#0E8D27';
                break;
            case (value < 20):
                currColor = '#EB4863'
                break;
            case (value < 100):
                currColor = '#5E9DDC'
                break;
            default:
                break;
        }
        return currColor
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
                        // < form ref={dropdownRef} className={styles.container} onSubmit={editCardProgress} >
                        //     <input className={styles.progressInput} type={'number'} placeholder={taskprogress} onChange={e => setCardProgress(e.target.value)} />
                        //     <button type='submit' className={styles.taskProgressButton} cardId={cardId} listId={listId} cardName>Edit</button>
                        // </form> 
                        <div ref={dropdownRef} className={styles.taskProgress} onBlur={editCardProgress}>
                            <input
                                className={styles.progressInput}
                                style={{
                                    backgroundColor: [getBackGroundColor(taskprogress)], padding: '5px', fontSize: "14px", border: 'solid black 1px',
                                    borderRadius: '5px', width: '100%',
                                    textAlign: 'center',
                                    color:'white'
                                }}
                                type={'number'} placeholder={taskprogress} onChange={e => setCardProgress(e.target.value)} />
                        </div >
                        :
                        <div className={styles.taskProgress} >
                            <button className={styles.taskProgressButton} onClick={() => setIsActive(!isActive)} >
                                <span>{showTaskProgress(taskprogress)}</span>
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



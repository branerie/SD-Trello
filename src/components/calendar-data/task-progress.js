import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';
import pen from '../../images/pen.svg'


export default function TaskProgress(props) {

    const today = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
    let card = props.card
    const [taskHistory, setTaskHistory] = useState(card.history)


    const value = props.value
    let taskprogress = ''
    let token = value.split('/')
    if (token.length > 1) {

        taskprogress = token[0]
    }


    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [cardProgress, setCardProgress] = useState(taskprogress)
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

        let arr = [...taskHistory]

        arr.push({
            'event': `Progress ${cardProgress}%`,
            'date': today
        })
        setTaskHistory(arr)




        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                progress: cardProgress,
                history: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            // setCardProgress('')
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
                Add Progress
                {/* <img src={pen} alt="..." width="11.5" height="11.5" /> */}
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
                currColor = '#EF2D2D'
                break;
            case (value < 100):
                currColor = '#5E9DDC'
                break;
            default:
                break;
        }
        return currColor
    }


    // let value = props.value

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
                        <div ref={dropdownRef} className={styles.taskProgress} onBlur={editCardProgress}>
                            <input
                                className={styles.progressInput}
                                style={{
                                    backgroundColor: [getBackGroundColor(taskprogress)],
                                    padding: '5px', fontSize: "14px", border: 'solid black 1px',
                                    borderRadius: '5px', width: '100%',
                                    textAlign: 'center',
                                    // color:'white'
                                }}
                                type={'number'}
                                value={cardProgress}
                                placeholder={'%'}
                                onChange={e => setCardProgress(e.target.value)}
                                min="0" max="100" />
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



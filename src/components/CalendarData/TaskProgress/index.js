import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import commonStyles from '../index.module.css'
import getCookie from '../../../utils/cookie'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import { useSocket } from '../../../contexts/SocketProvider'

export default function TaskProgress(props) {

    const today = useMemo(() => new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())), [])
    const card = props.card
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
    const history = useHistory()
    const socket = useSocket()
    const params = useParams()
    const teamId = params.teamid


    const editCardProgress = useCallback(async (event) => {
        event.preventDefault()

        // let data = props.value.split('/')
        // let cardId = data[1]
        // let listId = data[2]

        const cardId = card._id
        const listId = props.listId


        if (!cardProgress || (cardProgress > 100) || (cardProgress < 0)) {
            return
        }

        const cardProgressNum = Number(cardProgress)
        const newCardProgress = Math.max(Math.min(cardProgressNum, 100), 0)
        if (isNaN(cardProgressNum) || newCardProgress === Number(card.progress)) {
            return
        }

        setCardProgress(newCardProgress)

        const newTaskHistory = [...taskHistory, { event: `Progress ${cardProgress}%`, date: today }]
        setTaskHistory(newTaskHistory)


        const token = getCookie('x-auth-token')
        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                progress: cardProgress,
                history: newTaskHistory
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        setIsActive(!isActive)
        socket.emit('project-update', props.project)
        socket.emit('task-team-update', teamId)

    }, [history, cardProgress, isActive, setIsActive, taskHistory, today, card._id, props.listId, props.project, socket, teamId, card.progress])


    function showTaskProgress(value) {

        if (value && value !== 'null') {
            return (
                <div style={{
                    backgroundColor: getBackGroundColor(value),
                    padding: '5px',
                    border: 'solid black 1px',
                    borderRadius: '5px',
                    minHeight: '2rem',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} > {value} %</div>
            )

        }
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                + Add
            </div>
        )
    }


    function getBackGroundColor(value) {
        let currColor = ''
        switch (true) {
            case (value === 100 || value === '100'):
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



    return (
        <>

            {
                isActive ?
                    <div ref={dropdownRef} className={commonStyles.taskProgress} onBlur={editCardProgress}>
                        <input
                            className={commonStyles.taskProgressButtonInput}
                            style={{ backgroundColor: getBackGroundColor(cardProgress) }}
                            type={'number'}
                            value={cardProgress}
                            // placeholder={'%'}
                            onChange={e => setCardProgress(e.target.value)}
                            min='0' max='100'
                            autoFocus
                        />
                    </div >
                    :
                    // <div>
                    // { 
                    //     (taskprogress!== null)?

                    <div className={commonStyles.taskProgress} onClick={() => setIsActive(!isActive)}>
                        {/* <button className={commonStyles.taskProgressButton}  */}
                        {/* > */}
                        {showTaskProgress(taskprogress)}
                        {/* </button> */}
                    </div >
                // : <span>Add Progress</span>
                // }
                // </div>
            }
        </>
    )


}



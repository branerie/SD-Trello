import React, { useCallback, useMemo, useRef, useState } from 'react'
import commonStyles from '../index.module.css'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import { useParams } from 'react-router-dom'
import { useSocket } from '../../../contexts/SocketProvider'
import useCardsServices from '../../../services/useCardsServices'

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

    const dropdownRef = useRef(null)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [cardProgress, setCardProgress] = useState(taskprogress)
    const socket = useSocket()
    const params = useParams()
    const teamId = params.teamid
    const { editTask } = useCardsServices()

    const editCardProgress = useCallback(async (event) => {
        event.preventDefault()

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

        const editedFields = {
            progress: cardProgress,
            history: newTaskHistory
        }
        await editTask(listId, cardId, editedFields)

        setIsActive(!isActive)
        socket.emit('project-update', props.project)
        socket.emit('task-team-update', teamId)

    }, [editTask, cardProgress, isActive, setIsActive, taskHistory, today, card._id, props.listId, props.project, socket, teamId, card.progress])


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
                currColor = '#0E8D27'
                break
            case (value < 20):
                currColor = '#EF2D2D'
                break
            case (value < 100):
                currColor = '#5E9DDC'
                break
            default:
                break
        }
        return currColor
    }

    return (
        <>
            { isActive ?
                <div ref={dropdownRef} className={commonStyles.taskProgress} onBlur={editCardProgress}>
                    <input
                        className={commonStyles.taskProgressButtonInput}
                        style={{ backgroundColor: getBackGroundColor(cardProgress) }}
                        type={'number'}
                        value={cardProgress}
                        onChange={e => setCardProgress(e.target.value)}
                        min='0' max='100'
                        autoFocus
                    />
                </div >
                :
                <div className={commonStyles.taskProgress} onClick={() => setIsActive(!isActive)}>

                    {showTaskProgress(taskprogress)}
                </div >
            }
        </>
    )
}
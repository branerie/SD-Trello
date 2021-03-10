import React, { useRef, useState, useMemo, useEffect } from 'react'
import styles from './index.module.css'
import pic2 from '../../images/edit-card/pic2.svg'
import ProgressBar from '../ProgressBar'
import { useSocket } from '../../contexts/SocketProvider'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import useCardsServices from '../../services/useCardsServices'

export default function TaskProgress({ card, listId, project, teamId, taskHistory, setTaskHistory, setCurrCard }) {
    const socket = useSocket()
    const ref = useRef(null)
    const [progress, setProgress] = useState(null)
    const [currInput, setCurrInput] = useState(null)
    const [isInputOk, setIsInputOk] = useState(true)
    const [isInputActive, setIsInputActive] = useDetectOutsideClick(ref)
    const [isInputVisible, setIsInputVisible] = useState(false)
    const today = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), [])
    const { editTask } = useCardsServices()

    useEffect(() => {
        setIsInputVisible(card.progress !== null)
        setProgress(card.progress)
    }, [card.progress])

    const changeProgress = async () => {
        if (progress === null) {
            setIsInputVisible(false)
            setIsInputActive(false)
            return
        }

        if (currInput === progress || !isInputOk) {
            setProgress(currInput)
            setIsInputOk(true)
            return
        }

        const history = [...taskHistory]
        history.push({
            'event': `Progress ${progress}%`,
            'date': today
        })
        setTaskHistory(history)

        const editedFields = { progress, history }
        const updatedCard = await editTask(listId, card._id, editedFields)

        if (setCurrCard) setCurrCard(updatedCard)
        
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)

    }

    function onEscPressed(event) {
        if (event.keyCode === 27) {
            setProgress(currInput)
            setIsInputActive(false)
            setIsInputOk(true)
            if (progress === null) setIsInputVisible(false)
        }
    }

    function onKeyUp() {
        if (!progress || Number(progress) < 0 || Number(progress) > 100) {
            setIsInputOk(false)
        } else {
            setIsInputOk(true)
        }
    }

    function onClick() {
        setIsInputVisible(true)
        setIsInputActive(true)
        setCurrInput(progress)
    }

    return (
        <>
            <div className={styles['small-buttons']} onClick={onClick} >
                <img className={styles.pics} src={pic2} alt='' />
                Progress
            </div>
            {card.progress !== null &&
                <div className={styles['progress-bar']} >
                    <ProgressBar progress={card.progress} />
                </div>
            }
            {isInputVisible && <div className={styles['progress-input-container']}>
                {isInputActive ? <span ref={ref}>
                    <input
                        ref={function (input) {
                            if (input != null) {
                                input.focus();
                            }
                        }}
                        id='progress'
                        type='number'
                        min='0'
                        max='100'
                        className={`${styles['progress-input']} ${!isInputOk && styles['bad-input']}`}
                        value={progress}
                        onKeyDown={e => onEscPressed(e)}
                        onKeyUp={onKeyUp}
                        onChange={e => setProgress(e.target.value)}
                        onBlur={changeProgress}
                    /><span>%</span>
                </span> : <div className={styles.progress} onClick={onClick}>{progress}%</div>}
            </div>}
        </>
    )
}

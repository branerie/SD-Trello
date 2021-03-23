import React, { useEffect, useState } from 'react'
import { useSocket } from '../../../contexts/SocketProvider'
import styles from './index.module.css'
import useCardsServices from '../../../services/useCardsServices'
import { ESCAPE_KEY_CODE, ENTER_KEY_CODE } from '../../../utils/constats'
import getProgressBackgroundColor from '../../../utils/getProgressBackgroundColor'

const ProgressInput = ({
    card,
    listId,
    project,
    teamId,
    inputClassName,
    placeholderClassName,
    isBackgroundStyled
}) => {
    const socket = useSocket()
    const [progress, setProgress] = useState(null)
    const [currInput, setCurrInput] = useState(null)
    const [isInputActive, setIsInputActive] = useState(false)
    const [isInputOk, setIsInputOk] = useState(true)
    const { editTask } = useCardsServices()
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    useEffect(() => {
        setProgress(card.progress)
    }, [card.progress])

    const changeProgress = async () => {
        if (progress === null) {
            setIsInputActive(false)
            return
        }

        if (currInput === progress || !isInputOk) {
            setProgress(currInput)
            setIsInputOk(true)
            setIsInputActive(false)
            return
        }

        const history = [...card.history]
        history.push({
            event: `Progress ${progress}%`,
            date: today
        })

        const editedFields = { progress, history }
        await editTask(listId, card._id, editedFields)

        setIsInputActive(false)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)

    }

    const onKeyDown = (event) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            setProgress(currInput)
            setIsInputActive(false)
            setIsInputOk(true)

            return
        }

        if (event.keyCode === ENTER_KEY_CODE) {
            changeProgress()
        }
    }

    const onKeyUp = () => {
        if (!progress || Number(progress) < 0 || Number(progress) > 100) {
            setIsInputOk(false)
            return
        }

        setIsInputOk(true)
    }

    return (
        <>
            {isInputActive
                ? <input
                    autoFocus
                    type='number'
                    min='0'
                    max='100'
                    className={`${inputClassName} ${!isInputOk && styles['bad-input']}`}
                    value={progress}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onChange={e => setProgress(e.target.value)}
                    onBlur={changeProgress}
                    onFocus={() => setCurrInput(progress)}
                />
                : card.progress
                    ? <div
                        className={placeholderClassName}
                        onClick={() => setIsInputActive(true)}
                        style={isBackgroundStyled && { backgroundColor: getProgressBackgroundColor(progress) }}
                    >{card.progress}%</div>
                    : <div className={placeholderClassName} onClick={() => setIsInputActive(true)} >+Add</div>
            }
        </>
    )
}

export default ProgressInput
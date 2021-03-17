import React, { useEffect, useState } from 'react'
import { useSocket } from '../../../contexts/SocketProvider'
import useCardsServices from '../../../services/useCardsServices'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'

const ProgressInput = ({
    card,
    listId,
    project,
    teamId,
    setIsInputVisible,
    taskHistory,
    setTaskHistory,
    inputClassName,
    placeholderClassName,
    isInitialActive,
    isInputActive,
    setIsInputActive,
    ref
}) => {
    const socket = useSocket()
    const [progress, setProgress] = useState(null)
    const [currInput, setCurrInput] = useState(null)
    const [isInputOk, setIsInputOk] = useState(true)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const { editTask } = useCardsServices()

    if (isInitialActive) {
        setIsInputActive(true)
        isInitialActive = false
    }

    useEffect(() => {
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
            event: `Progress ${progress}%`,
            date: today
        })
        setTaskHistory(history)

        const editedFields = { progress, history }
        await editTask(listId, card._id, editedFields)

        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)

    }

    const onEscPressed = (event) => {
        if (event.keyCode === 27) {
            setProgress(currInput)
            setIsInputActive(false)
            setIsInputOk(true)
            if (progress === null) setIsInputVisible(false)
        }
    }

    const onKeyUp = () => {
        if (!progress || Number(progress) < 0 || Number(progress) > 100) {
            setIsInputOk(false)
        } else {
            setIsInputOk(true)
        }
    }

    const onClick = () => {
        setIsInputActive(true)
    }

    return (
        <div>
            {isInputActive
                ? <span ref={ref}>
                    <input
                        // ref={function (input) {
                        //     if (input != null) {
                        //         input.focus();
                        //     }
                        // }}
                        autoFocus
                        // id='progress'
                        type='number'
                        min='0'
                        max='100'
                        className={inputClassName}
                        value={progress}
                        onKeyDown={onEscPressed}
                        onKeyUp={onKeyUp}
                        onChange={e => setProgress(e.target.value)}
                        onBlur={changeProgress}
                        onFocus={() => setCurrInput(progress)}
                    />
                </span>
                : <div className={placeholderClassName} onClick={onClick}>{card.progress}%</div>}
        </div>
    )
}

export default ProgressInput

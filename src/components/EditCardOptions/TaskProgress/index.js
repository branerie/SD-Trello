import React, { useState, useMemo, useEffect } from 'react'
import { useSocket } from '../../../contexts/SocketProvider'
import commonStyles from '../index.module.css'
import styles from './index.module.css'
import ProgressBar from '../../ProgressBar'
import progressPic from '../../../images/edit-card/progress.svg'
import useCardsServices from '../../../services/useCardsServices'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import ProgressInput from '../../Inputs/ProgressInput'

const TaskProgress = ({ card, listId, project, teamId, taskHistory, setTaskHistory }) => {
    // const socket = useSocket()
    // const [progress, setProgress] = useState(null)
    // const [currInput, setCurrInput] = useState(null)
    // const [isInputOk, setIsInputOk] = useState(true)
    const [isInputVisible, setIsInputVisible] = useState(false)
    const [isInputActive, setIsInputActive, ref] = useDetectOutsideClick()
    // const today = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), [])
    // const { editTask } = useCardsServices()

    useEffect(() => {
        setIsInputVisible(card.progress !== null)
        // setProgress(card.progress)
    }, [card.progress])

    // const changeProgress = async () => {
    //     if (progress === null) {
    //         setIsInputVisible(false)
    //         setIsInputActive(false)
    //         return
    //     }

    //     if (currInput === progress || !isInputOk) {
    //         setProgress(currInput)
    //         setIsInputOk(true)
    //         return
    //     }

    //     const history = [...taskHistory]
    //     history.push({
    //         event: `Progress ${progress}%`,
    //         date: today
    //     })
    //     setTaskHistory(history)

    //     const editedFields = { progress, history }
    //     await editTask(listId, card._id, editedFields)

    //     socket.emit('project-update', project)
    //     socket.emit('task-team-update', teamId)

    // }

    // function onEscPressed(event) {
    //     if (event.keyCode === 27) {
    //         setProgress(currInput)
    //         setIsInputActive(false)
    //         setIsInputOk(true)
    //         if (progress === null) setIsInputVisible(false)
    //     }
    // }

    // function onKeyUp() {
    //     if (!progress || Number(progress) < 0 || Number(progress) > 100) {
    //         setIsInputOk(false)
    //     } else {
    //         setIsInputOk(true)
    //     }
    // }

    function onClick() {
        setIsInputVisible(true)
        // setIsInputActive(true)
        // setCurrInput(progress)
    }

    return (
        <>
            <div className={commonStyles['small-buttons']} onClick={onClick} >
                <img className={commonStyles.pics} src={progressPic} alt='' />
                Progress
            </div>
            {card.progress !== null &&
                <div className={styles['progress-bar']} >
                    <ProgressBar progress={card.progress} />
                </div>
            }
            {isInputVisible && <div className={styles['progress-input-container']}>
                <ProgressInput
                    card={card}
                    listId={listId}
                    project={project}
                    teamId={teamId}
                    setIsInputVisible={setIsInputVisible}
                    taskHistory={taskHistory}
                    setTaskHistory={setTaskHistory}
                    inputClassName={styles['progress-input']}
                    placeholderClassName={styles.progress}
                    isInitialActive={true}
                    isInputActive={isInputActive}
                    setIsInputActive={setIsInputActive}
                    ref={ref}
                />
                {/* {isInputActive ? <span ref={ref}>
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
                        onKeyDown={onEscPressed}
                        onKeyUp={onKeyUp}
                        onChange={e => setProgress(e.target.value)}
                        onBlur={changeProgress}
                    /><span>%</span>
                </span>
                :
                <div className={styles.progress} onClick={onClick}>{progress}%</div>} */}
            </div>}
        </>
    )
}

export default TaskProgress
import React, { useState, useRef, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import Transparent from '../Transparent'
import EditCard from '../EditCard'
import AttachmentsLink from '../AttachmentsLink'
import useCardsServices from '../../services/useCardsServices'
import pen from '../../images/pen.svg'

const MyTasksTask = ({ teamId, project, list, card }) => {
    const inputRef = useRef(null)
    const [isInputActive, setIsInputActive] = useState(false)
    const [isEditCardActive, setIsEditCardActive] = useState(false)
    const [progress, setProgress] = useState('')
    const [isInputOk, setIsInputOk] = useState(true)
    const socket = useSocket()
    const { editTask } = useCardsServices()
    const days = Math.ceil((Date.parse(card.dueDate) - Date.now()) / 1000 / 3600 / 24)

    useEffect(() => {
        if (card.progress === null) {
            setProgress('Add')
            return
        }

        setProgress(card.progress + '%')
    }, [setProgress, card.progress])

    async function onBlur() {
        setIsInputActive(false)
        if (!isInputOk || Number(progress) === card.progress) {
            setProgress(card.progress + '%')
            setIsInputOk(true)
            return
        }

        if (progress === '') {
            if (card.progress === null) {
                setProgress('Add')
                return
            }
            setProgress(card.progress + '%')
        }

        const today = new Date(Date.now())
        let history = [...card.history]

        history.push({
            'event': `Progress ${progress}%`,
            'date': today
        })

        const editedFields = { progress, history }
        await editTask(list._id, card._id, editedFields)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }

    function onKeyUp() {
        if (Number.isNaN(Number(progress)) || Number(progress) < 0 || Number(progress) > 100) {
            setIsInputOk(false)
        } else {
            setIsInputOk(true)
        }
    }

    function onFocus() {
        setIsInputActive(true)
        if (progress === 'Add') {
            setProgress('')
            return
        }
        setProgress(Number(progress.slice(0, -1)))
    }

    return (
        <div key={card._id} className={styles.card}>
            <div className={styles.task}>{card.name}</div>
            <div className={styles.progress}>
                <input
                    ref={inputRef}
                    type={'text'}
                    className={`${styles.input} ${!isInputOk && styles['bad-input']} ${!isInputActive && styles['no-border']}`}
                    autoComplete='off'
                    value={progress}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyUp={onKeyUp}
                    onChange={e => setProgress(e.target.value)}
                />
            </div>
            <div className={styles.days}>
                {card.progress === 100 
                    ? <div>Done</div> 
                    : Date.parse(card.dueDate) === 0 || card.dueDate === null || card.dueDate === undefined
                        ? <div>No Deadline</div>
                        : days < 0
                            ? <div className={styles.deadline}>Deadline Passed</div>
                            : <div>{days}</div>
                }
            </div>
            <div className={styles['buttons-container']}>
                {card.attachments.length > 0 && <AttachmentsLink card={card} project={project} teamId={teamId} />}
                <ButtonClean
                    className={styles.button}
                    onClick={() => setIsEditCardActive(true)}
                    title={<img src={pen} alt='' width='14' />}
                />
            </div>
            { isEditCardActive && <div className={styles.edit}>
                <Transparent hideForm={() => setIsEditCardActive(!isEditCardActive)} >
                    <EditCard
                        hideForm={() => setIsEditCardActive(!isEditCardActive)}
                        initialCard={card}
                        listId={list._id}
                        project={project}
                        teamId={teamId}
                    />
                </Transparent>
            </div>}
        </div>
    )
}

export default MyTasksTask
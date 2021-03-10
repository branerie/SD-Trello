import React, { useRef, useState, useMemo, useEffect } from 'react'
import styles from './index.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useSocket } from '../../contexts/SocketProvider'
import pic1 from '../../images/edit-card/pic1.svg'
import pic12 from '../../images/edit-card/pic12.svg'
import TaskMembers from '../EditCardOptions/TaskMembers'
import TaskDueDate from '../EditCardOptions/TaskDueDate'
import TaskHistory from '../EditCardOptions/TaskHistory'
import TaskProgress from '../EditCardOptions/TaskProgress'
import TaskAttach from '../EditCardOptions/TaskAttach'
import ConfirmDialog from '../ConfirmationDialog'
import useCardsServices from '../../services/useCardsServices'


export default function EditCard({ listId, initialCard, project, teamId, hideForm, setCurrCard }) {
    const nameRef = useRef(null)
    const descriptionRef = useRef(null)
    const [card, setCard] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [taskHistory, setTaskHistory] = useState(null)
    const socket = useSocket()
    const [nameHeight, setNameHeight] = useState(null)
    const [currInput, setCurrInput] = useState(null)
    const dueDate = useMemo(() => new Date(initialCard.dueDate), [initialCard.dueDate])
    const [confirmOpen, setConfirmOpen] = useState(false)
    const { deleteTask, editTask } = useCardsServices()

    useEffect(() => {
        setCard(initialCard)
        setName(initialCard.name)
        setDescription(initialCard.description)
        setTaskHistory(initialCard.history)
    }, [initialCard])


    const handleDeleteTask = async () => {
        await deleteTask(listId, card._id)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
        hideForm()
    }

    const handleSubmit = async () => {
        const editedFields = { name, description }
        await editTask(listId, card._id, editedFields)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }

    useEffect(() => {
        setTimeout(() => {
            setNameHeight(nameRef.current.scrollHeight + 2)
        }, 1);
    }, [])

    function onEscPressed(event, setElement, ref) {
        if (event.keyCode === 27) {
            setElement(currInput)
            setTimeout(() => {
                ref.current.blur()
            }, 1);
        }
    }

    return (
        <div className={styles.menu}>

            {confirmOpen &&
                <ConfirmDialog
                    title={'delete this task'}
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={handleDeleteTask}
                />
            }

            <div className={styles.container}>

                <div className={styles['task-name']}>
                    <span>
                        <img src={pic1} alt='pic1' />
                    </span>
                    <textarea
                        ref={nameRef}
                        className={`${styles['name-input']} ${styles.text}`}
                        style={{ 'height': nameHeight }}
                        value={name}
                        onFocus={() => setCurrInput(name)}
                        onKeyDown={e => onEscPressed(e, setName, nameRef)}
                        onChange={e => {
                            setName(e.target.value)
                            setNameHeight(nameRef.current.scrollHeight + 2)
                        }}
                        onBlur={() => {
                            if (currInput === name) return
                            handleSubmit()
                        }}
                    />
                </div>
                <div className={styles['task-body']} >

                    <div className={styles['left-side']}>
                        <div>
                            <div className={styles.text}>Description</div>
                            <textarea className={styles['description-input']}
                                ref={descriptionRef}
                                value={description}
                                onFocus={() => setCurrInput(description)}
                                onKeyDown={e => onEscPressed(e, setDescription, descriptionRef)}
                                onChange={e => setDescription(e.target.value)}
                                onBlur={() => {
                                    if (currInput === description) return
                                    handleSubmit()
                                }}
                            />
                        </div>
                        <div className={styles['task-component']}>
                            <div className={styles.text}>History</div>
                            <TaskHistory taskHistory={taskHistory} />
                        </div>
                    </div>

                    <div className={styles['right-side']}>

                        <div className={styles['task-component']}>
                            <div className={styles.text}>Manage</div>
                            <TaskDueDate
                                dueDate={dueDate}
                                card={initialCard}
                                listId={listId}
                                project={project}
                                teamId={teamId}
                                setCurrCard={setCurrCard}
                            />
                            <TaskMembers
                                card={initialCard}
                                listId={listId}
                                project={project}
                                teamId={teamId}
                                setCurrCard={setCurrCard}
                            />
                            <TaskProgress
                                card={initialCard}
                                listId={listId}
                                project={project}
                                teamId={teamId}
                                taskHistory={taskHistory}
                                setTaskHistory={setTaskHistory}
                                setCurrCard={setCurrCard}
                            />
                            <TaskAttach
                                card={initialCard}
                                project={project}
                                teamId={teamId}
                                setCurrCard={setCurrCard}
                            />
                            <button
                                className={styles['small-buttons']}
                                onClick={() => setConfirmOpen(true)}
                                title='Delete Task'
                            >
                                <img className={styles.pics} src={pic12} alt='pic12' />
                                Delete Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

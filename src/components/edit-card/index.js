import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import { useSocket } from '../../contexts/SocketProvider'
import pic1 from '../../images/edit-card/pic1.svg'
// import pic2 from '../../images/edit-card/pic2.svg'
// import pic3 from '../../images/edit-card/pic3.svg'
// import pic4 from '../../images/edit-card/pic4.svg'
// import pic5 from '../../images/edit-card/pic5.svg'
// import pic6 from '../../images/edit-card/pic6.svg'
// import pic7 from '../../images/edit-card/pic7.svg'
// import pic8 from '../../images/edit-card/pic8.svg'
// import pic9 from '../../images/edit-card/pic9.svg'
// import pic10 from '../../images/edit-card/pic10.svg'
// import pic11 from '../../images/edit-card/pic11.svg'
import pic12 from '../../images/edit-card/pic12.svg'
// import pic13 from '../../images/edit-card/pic13.svg'
// import pic14 from '../../images/edit-card/pic14.svg'
import TaskMembers from '../edit-card-options/taskMembers'
import TaskDueDate from "../edit-card-options/taskDueDate"
import TaskHistory from '../edit-card-options/taskHistory'
import TaskProgress from '../edit-card-options/taskProgress'
import TaskAttach from '../edit-card-options/taskAttach'
import ConfirmDialog from '../confirmation-dialog'


export default function EditCard({ listId, initialCard, project, teamId, hideForm }) {
    const nameRef = useRef(null)
    const descriptionRef = useRef(null)
    const [card, setCard] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [taskHistory, setTaskHistory] = useState(null)
    const history = useHistory()
    const socket = useSocket()
    const [nameHeight, setNameHeight] = useState(null)
    const [currInput, setCurrInput] = useState(null)
    const dueDate = useMemo(() => new Date(initialCard.dueDate), [initialCard.dueDate])
    const token = getCookie("x-auth-token")
    const [confirmOpen, setConfirmOpen] = useState(false)

    useEffect(() => {
        setCard(initialCard)
        setName(initialCard.name)
        setDescription(initialCard.description)
        setTaskHistory(initialCard.history)
    }, [initialCard])


    const deleteCard = async () => {

        // if (!window.confirm('Are you sure you wish to delete this item?')) return

        const response = await fetch(`/api/projects/lists/cards/${listId}/${card._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            socket.emit('project-update', project)
            socket.emit('task-team-update', teamId)
            hideForm()
        }
    }


    const handleSubmit = async () => {

        const response = await fetch(`/api/projects/lists/cards/${listId}/${card._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            // const updatedCard = await response.json()
            // setCard(updatedCard)
            socket.emit('project-update', project)
            socket.emit('task-team-update', teamId)
            // setProgressChanged(false)
        }
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
                    onConfirm={() => deleteCard()}
                />
            }

            <div className={styles.container}>

                <div className={styles['task-name']}>
                    <span>
                        <img src={pic1} alt="pic1" />
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
                            />
                            <TaskMembers
                                card={initialCard}
                                listId={listId}
                                project={project}
                                teamId={teamId}
                            />
                            <TaskProgress
                                card={initialCard}
                                listId={listId}
                                project={project}
                                teamId={teamId}
                                taskHistory={taskHistory}
                                setTaskHistory={setTaskHistory}
                            />
                            <TaskAttach
                                card={initialCard}
                                project={project}
                                teamId={teamId}
                            />
                            <button className={styles['small-buttons']} 
                            // onClick={deleteCard} 
                            onClick={() => {
                                setConfirmOpen(true)                            
                            }}
                            title="Delete Task" >
                                <img className={styles.pics} src={pic12} alt="pic12" />
                            Delete Task
                        </button>


                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic3} alt="pic3" />
                            Join
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic4} alt="pic4" />
                            Stickers
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic5} alt="pic5" />
                            Due Date
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic7} alt="pic7" />
                            Reports
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic10} alt="pic10" />
                            Add Teammate
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic11} alt="pic11" />
                            Make Template
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic13} alt="pic13" />
                            Remove List
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic8} alt="pic8" />
                            Settings
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic9} alt="pic9" />
                            View
                        </div> */}
                            {/* <div className={styles['small-buttons']} >
                            <img className={styles.pics} src={pic14} alt="pic14" />
                            Archive
                        </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

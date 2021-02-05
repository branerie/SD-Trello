import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import { useSocket } from '../../contexts/SocketProvider'
import pic1 from '../../images/edit-card/pic1.svg'
import pic2 from '../../images/edit-card/pic2.svg'
import pic3 from '../../images/edit-card/pic3.svg'
import pic4 from '../../images/edit-card/pic4.svg'
import pic5 from '../../images/edit-card/pic5.svg'
import pic6 from '../../images/edit-card/pic6.svg'
import pic7 from '../../images/edit-card/pic7.svg'
import pic8 from '../../images/edit-card/pic8.svg'
import pic9 from '../../images/edit-card/pic9.svg'
import pic10 from '../../images/edit-card/pic10.svg'
import pic11 from '../../images/edit-card/pic11.svg'
import pic12 from '../../images/edit-card/pic12.svg'
import pic13 from '../../images/edit-card/pic13.svg'
import pic14 from '../../images/edit-card/pic14.svg'
import TaskMembers from '../task-members'
import TaskDueDate from "../task-dueDate"
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import TaskHistory from '../task-history'


export default function EditCard({ listId, initialCard, project, teamId, hideForm }) {
    const dropdownRef = useRef(null);
    const nameRef = useRef(null);
    const [card, setCard] = useState(initialCard)
    const [name, setName] = useState(card.name)
    const [description, setDescription] = useState(card.description)
    const [progress, setProgress] = useState(card.progress)
    const [taskHistory, setTaskHistory] = useState(card.history)
    const [progressChanged, setProgressChanged] = useState(false)
    const [progressType, setProgressType] = useState('text')
    const history = useHistory()
    const socket = useSocket()
    const [nameHeight, setNameHeight] = useState(null)
    const [currInput, setCurrInput] = useState(null)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [isProgressActive, setIsProgressActive] = useDetectOutsideClick(dropdownRef)
    const [isDescriptionActive, setIsDescriptionActive] = useState(false)
    const dueDate = useMemo(() => new Date(card.dueDate), [card.dueDate])
    const today = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), [])
    const cardId = card._id
    const token = getCookie("x-auth-token")

    useEffect(() => {
        setCard(initialCard)
    }, [initialCard])


    const deleteCard = useCallback(async (event) => {

        event.preventDefault()

        if (!window.confirm('Are you sure you wish to delete this item?')) {
            return
        }
        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
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
    }, [history, project, teamId, cardId, listId, socket, token, hideForm])


    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()


        if (Number(progress) > 100) {
            setProgress(100)
            return
        } else if (Number(progress) < 0) {
            setProgress(0)
            return
        }

        let arr = [...taskHistory]
        if (progressChanged) {
            arr.push({
                'event': `Progress ${progress}%`,
                'date': today
            })
            setTaskHistory(arr)
        }

        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                dueDate,
                progress,
                history: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const updatedCard = await response.json()
            setCard(updatedCard)
            socket.emit('project-update', project)
            socket.emit('task-team-update', teamId)
            setIsActive(false)
            setIsProgressActive(false)
            setIsDescriptionActive(false)
            setProgressChanged(false)
        }

    }, [history, name, description, dueDate, progress, listId, cardId, setIsActive, setIsProgressActive, progressChanged, taskHistory, today, socket, teamId, project, token])



    const progressColor = (progress) => {
        if (Number(progress) <= 20) {
            return 'red'
        }
        if (Number(progress) <= 40) {
            return 'orange'
        }
        if (Number(progress) <= 80) {
            return 'blue'
        }
        if (Number(progress) > 80) {
            return 'green'
        }
    }

    const changeProgress = (value) => {
        setProgress(value)
        setProgressChanged(true)
    }

    useEffect(() => {
        setNameHeight(nameRef.current.scrollHeight + 2)
    }, [])

    return (
        <div className={styles.container}>

            <div className={styles['task-name']}>
                <span>
                    <img src={pic1} alt="pic1" />
                </span>
                <textarea
                    ref={nameRef}
                    className={styles['name-input']}
                    style={{ 'height': nameHeight }}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setNameHeight(nameRef.current.scrollHeight + 2)
                    }}
                    onBlur={e => {
                        if (currInput === name) return
                        handleSubmit(e)
                    }}
                    onFocus={() => setCurrInput(name)}
                />
            </div>

            <div className={styles['task-body']} >

                <div className={styles['left-side']}>

                    <div className={styles['task-progress']} >
                        <label for='progress'>
                            <img src={pic2} alt="pic2" />
                            <span className={styles['margin-left']}>Progress</span>
                        </label>
                        <div className={styles['progress-bar']} >
                            {
                                card.progress ?
                                    <div className={styles.bar} >
                                        <div
                                            style={{
                                                width: `${card.progress}%`,
                                                backgroundColor: progressColor(card.progress)
                                            }}
                                            className={styles.progress}
                                        />
                                    </div> : null
                            }
                        </div>
                        <div className={styles['progress-input-container']}>
                            <input
                                id='progress'
                                type={progressType}
                                ref={dropdownRef}
                                className={styles['progress-input']}
                                value={progress}
                                onChange={e => changeProgress(e.target.value)}
                                min="0"
                                max="100"
                                onBlur={e => {
                                    setProgressType('text')
                                    if (currInput === progress) return
                                    handleSubmit(e)
                                }}
                                onFocus={() => {
                                    setCurrInput(progress)
                                    setProgressType('number')
                                }}
                            />%
                        </div>

                    </div>








                    <div className={styles.thirdRow}>

                        <div className={styles.descriptinTitle}>
                            <p className={styles.text}>Description</p>
                        </div>
                        <textarea className={styles.descriptionInput}
                            ref={dropdownRef}
                            value={description}
                            onChange={(e) => { setDescription(e.target.value); setIsDescriptionActive(true) }}
                        />
                        {
                            isDescriptionActive ?

                                <div className={styles.descriptionButtons}>
                                    <span>
                                        <button onClick={handleSubmit} className={styles.editButton} >Edit</button>
                                    </span>
                                    <span>
                                        <button onClick={(e) => { setDescription(card.description); setIsDescriptionActive(false) }} className={styles.editButton} >Cancel</button>
                                    </span>

                                </div>
                                : null
                        }




                    </div>


                    <div className={styles.fourthRow}>

                        <div className={styles.descriptinTitle}>
                            <p className={styles.text}>History</p>
                        </div>
                        <TaskHistory taskHistory={taskHistory} />
                    </div>
                </div>



                <div className={styles['right-side']}>


                    <div className={styles.membersDiv}>
                        <div >
                            <p className={styles.text}>Members</p>
                        </div>
                        <div className={styles.members}>
                            <TaskMembers
                                card={card}
                                size={30}
                                listId={listId}
                                project={project}
                                title={'Add'}
                                teamId={teamId}
                            />
                        </div>
                    </div>


                    <div className={styles.secondRow}>
                        <div >
                            <div className={styles.dueDate} >
                                <TaskDueDate
                                    cardDueDate={dueDate}
                                    cardId={cardId}
                                    listId={listId}
                                    project={project}
                                    showEditCard={false}
                                    teamId={teamId}
                                />
                            </div>

                        </div>
                    </div>


                    <div className={styles.smallButtonsContainer}>
                        <div>
                            <p className={styles.text}>Add</p>
                        </div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic3} alt="pic3" />
                            Join</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic4} alt="pic4" />
                            Stickers</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic5} alt="pic5" />
                            Due Date</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic6} alt="pic6" />
                            Attach file</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic7} alt="pic7" />
                            Reports</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic10} alt="pic10" />
                            Add Teammate</div>
                    </div>


                    <div className={styles.smallButtonsContainer}>
                        <div>
                            <p className={styles.text}>Manage</p>
                        </div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic11} alt="pic11" />
                            Make Template</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic13} alt="pic13" />
                            Remove List</div>
                        <button className={styles.smallButtons} onClick={(e) => { deleteCard(e) }} title="Delete Task" >
                            <img className={styles.picsSmallButtons} src={pic12} alt="pic12" />
                         Delete Task</button>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic8} alt="pic8" />
                            Settings</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic9} alt="pic9" />
                            View</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic14} alt="pic14" />
                            Archive</div>
                    </div>


                </div>

            </div>
        </div>

    )
}

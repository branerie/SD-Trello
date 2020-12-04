import React, { useCallback, useRef, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import AddMember from '../add-card-member'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Transparent from '../transparent'
import { useSocket } from '../../contexts/SocketProvider'
import pic1 from '../../images/edit-card/pic1.svg'
import pic2 from '../../images/edit-card/pic2.svg'

import Avatar from 'react-avatar'
import ButtonClean from '../button-clean'
import pen from '../../images/pen.svg'
import TaskMembers from '../calendar-data/task-members'
import TaskDueDate from "../calendar-data/task-dueDate"
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'



export default function EditCard(props) {


    const card = props.card

    const dropdownRef = useRef(null);
    const [name, setName] = useState(card.name)
    const [description, setDescription] = useState(card.description)
    const members = props.card.members
    const [dueDate, setDueDate] = useState(new Date(card.dueDate))
    const [progress, setProgress] = useState(card.progress)
    const history = useHistory()
    const socket = useSocket()
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [isProgressActive, setIsProgressActive] = useDetectOutsideClick(dropdownRef)
    const [isDescriptionActive, setIsDescriptionActive] = useState(false)


    const cardId = card._id
    const listId = props.listId

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])




    const cancelSubmit = () => {
        props.hideFormEdit()
    }

    const deleteCard = useCallback(async (event) => {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
            props.hideFormEdit()
        }

    }, [history, props, cardId, listId, updateProjectSocket])


    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()

        if (Number(progress) > 100) {
            setProgress(100)
            return
        } else if (Number(progress) < 0) {
            setProgress(0)
            return
        }


        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                dueDate,
                progress
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
            setIsActive(false)
            setIsProgressActive(false)
            setIsDescriptionActive(false)
        }

    }, [history, name, description, dueDate, progress, listId, cardId, updateProjectSocket])

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

    let thisCardDate = ''
    if (dueDate && dueDate !== 0) {
        thisCardDate = dueDate.getTime()
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} >
                <div className={styles.leftSide}>

                    <div className={styles.firstRow}>
                        <div className={styles.inputTitles}>
                            <span className={styles.pic1}>
                                <img src={pic1} alt="pic1" />
                            </span>
                            {
                                isActive ?
                                    <div ref={dropdownRef}>
                                        <span className={styles.nameContainer}>
                                            <input className={styles.nameInput} value={name} onChange={e => setName(e.target.value)} />
                                            <button onClick={handleSubmit} className={styles.editButton} >Edit</button>
                                        </span>
                                    </div> :
                                    <span className={styles.nameContainer}>
                                        <p className={styles.textName} onClick={() => setIsActive(!isActive)}>{card.name}</p>
                                    </span>
                            }
                        </div >
                    </div>

                    <div className={styles.secondRow}>
                        <div className={styles.inputTitles}>
                            <span className={styles.pic2}>
                                <img src={pic2} alt="pic2" />
                            </span>
                            {
                                isProgressActive ?
                                    <div ref={dropdownRef}>
                                        <span className={styles.progressInputContainer}>
                                            <input type='number' className={styles.nameInput} value={progress} onChange={e => setProgress(e.target.value)} />
                                            <button onClick={handleSubmit} className={styles.editButton} >Edit</button>
                                        </span></div>
                                    :
                                    <span className={styles.nameContainer}>
                                        <p className={styles.textName} onClick={() => setIsProgressActive(true)} >Progress</p>
                                    </span>
                            }
                        </div>

                        <div className={styles.progressDiv}>
                            {
                                card.progress ?
                                    <div className={styles.bar} >
                                        <div
                                            style={{
                                                width: `${card.progress}%`,
                                                ['backgroundColor']: progressColor(card.progress)
                                            }}
                                            className={styles.progress}
                                        />
                                    </div> : null
                            }
                            <span>{card.progress} %</span>
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


                    <div className={styles.lasRow}>
                        <Button onClick={handleSubmit} title="Edit Task" />
                        <Button onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) deleteCard(e) }} title="Delete Task" />
                        <Button onClick={cancelSubmit} title="Cancel" />
                    </div>

                </div>

                <div className={styles.rightSide}>
                    <div className={styles.membersContainer}>
                        <div className={styles.inputTitles}>
                            <p className={styles.text}>Members</p>
                        </div>
                        <TaskMembers cardMembers={members} size={30} cardId={cardId} listId={listId} project={props.project} title={'Add'} />
                    </div>


                    <div className={styles.secondRow}>
                        <div className={styles.inputTitles}>
                            <p className={styles.text}>Due Date</p>
                        </div>
                        <TaskDueDate cardDueDate={dueDate} cardId={cardId} listId={listId} />
                    </div>

                </div>


            </form>
        </div>

    )
}

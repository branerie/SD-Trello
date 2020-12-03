import React, { useCallback, useState } from 'react'
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



export default function EditCard(props) {
    const [name, setName] = useState(props.card.name)
    const [description, setDescription] = useState(props.card.description)
    const members = props.card.members
    const [dueDate, setDueDate] = useState(new Date(props.card.dueDate))
    const [progress, setProgress] = useState(props.card.progress)
    const [IsVisibleAdd, setIsVisibleAdd] = useState(false)
    const history = useHistory()
    const socket = useSocket()

    const cardId = props.card._id
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
            props.hideFormEdit()
        }

    }, [history, name, description, dueDate, progress, listId, cardId, props, updateProjectSocket])

    const showFormAdd = () => {
        setIsVisibleAdd(true)
    }

    const hideFormAdd = () => {
        setIsVisibleAdd(false)
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
                            <span>
                                <p className={styles.text}>Name</p>
                            </span>
                        </div>
                        <input className={styles.nameInput}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            // label="Name"
                            id="name"
                        />
                    </div>

                    <div className={styles.secondRow}>
                        <div className={styles.inputTitles}>
                            <span className={styles.pic2}>
                                <img src={pic2} alt="pic2" />
                            </span>
                            <span>
                                <p className={styles.text}>Progress</p>
                            </span>
                        </div>
                        <input className={styles.nameInput}
                            value={progress}
                            onChange={e => setProgress(e.target.value)}
                            // label="Progress"
                            id="progress"
                        />
                    </div>


                    <div className={styles.thirdRow}>
                        <div className={styles.descriptinTitle}>
                            <p className={styles.text}>Description</p>
                        </div>
                        <textarea className={styles.descriptionInput}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            // label="Description"
                            id="description"
                        />
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
                        <TaskMembers cardMembers={members} size={40} cardId={cardId} listId={listId} project={props.project} title={'Add'} />
                    </div>


                    <div className={styles.secondRow}>
                        <div className={styles.inputTitles}>
                            <p className={styles.text}>Due Date</p>
                        </div>
                        <TaskDueDate cardDueDate={dueDate} cardId={cardId} listId={listId} />
                    </div>

                </div>









                {/* </div> */}
                {/* </div> */}
            </form>
        </div>

    )
}

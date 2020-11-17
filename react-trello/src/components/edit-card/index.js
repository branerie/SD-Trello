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
                progress,
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

    return (
        <div className={styles.form}>
            <div>
                <form className={styles.container} >
                    <Title title="Edit Card" />
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        label="Name"
                        id="name"
                    />
                    <Input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        label="Description"
                        id="description"
                    />
                    <DatePicker selected={dueDate} onChange={date => setDueDate(date)} label="Due Date" />
                    <Input
                        value={progress}
                        onChange={e => setProgress(e.target.value)}
                        label="Progress"
                        id="progress"
                    />


                </form>
            </div>
            <div className={styles.editMembers}>
                <span>Card members: </span>
                {
                    members.map((element, index) => {
                        return <span key={index} className={styles.membersNames}>{element.username}</span>
                    })
                }
                <button onClick={showFormAdd} title="Edit members" className={styles.editMembersButton}>Edit members</button>
                {IsVisibleAdd ?
                    < div >
                        <Transparent hideFormAdd={hideFormAdd} >
                            <AddMember hideFormAdd={hideFormAdd} card={props.card} listId={listId} />
                        </Transparent >
                    </div > : null
                }
                <div className={styles.editCardButtons}>
                    <Button onClick={handleSubmit} title="Edit Card" />
                    <Button onClick={cancelSubmit} title="Cancel" />
                    <Button onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) deleteCard(e) }} title="Delete Card" />
                </div>
            </div>
        </div>

    )
}

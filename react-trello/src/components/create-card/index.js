import React, { useCallback, useState } from 'react'
import { useHistory } from "react-router-dom"
import SubmitButton from '../button/submit-button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useSocket } from '../../contexts/SocketProvider'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function CreateCard(props) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [progress, setProgress] = useState("")
    const history = useHistory()
    const socket = useSocket()

    const id = props.listId

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                dueDate,
                progress,
                members: []
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            updateProjectSocket()
            props.hideForm()
        }

    }, [history, name, description, dueDate, progress, id, props, updateProjectSocket])

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Create Card" />
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
                    type={Number}
                    value={progress}
                    onChange={e => setProgress(e.target.value)}
                    label="Progress"
                    id="progress"
                />
                <SubmitButton title="Create" />
            </form>
        </div>
    )
}

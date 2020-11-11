import React, { useCallback, useState } from 'react'
import { useHistory } from "react-router-dom"
import SubmitButton from '../button/submit-button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'

export default function CreateCard(props) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [progress, setProgress] = useState("")
    const history = useHistory()

    const id = props.listId

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
        } else {
            props.updateProjectSocket()
            props.hideForm()
        }

    }, [history, name, description, dueDate, progress, id, props])

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
                <Input
                    type={Number}
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    label="Due Date"
                    id="dueDate"
                />
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

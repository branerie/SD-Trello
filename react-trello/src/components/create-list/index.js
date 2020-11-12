import React, { useCallback, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useSocket } from '../../contexts/SocketProvider'
import "react-datepicker/dist/react-datepicker.css"

export default function CreateList(props) {
    const [name, setName] = useState("")
    const history = useHistory()
    const socket = useSocket()

    const id = props.project._id

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ name })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            updateProjectSocket()
            props.hideForm()
        }

    }, [history, name, id, props, updateProjectSocket])

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Create List" />
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Name"
                    id="name"
                />
                <Button title="Create" />
            </form>
        </div>
    )
}

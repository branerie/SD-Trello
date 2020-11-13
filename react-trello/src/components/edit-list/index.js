import React, { useCallback, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import { useSocket } from '../../contexts/SocketProvider'


export default function EditList(props) {
    const [name, setName] = useState(props.list.name)
    const history = useHistory()
    const socket = useSocket()

    const projectId = props.project._id
    const listId = props.list._id

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])

    async function handleSubmit(event) {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/${projectId}/${listId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ name })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
            props.hideForm()
        }

    }

    return (
        <div className={styles.form}>
            <form className={styles.container} >
                <Title title="Edit List" />
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Name"
                    id="name"
                />
                <Button onClick={handleSubmit} title="Edit List" />
            </form>
        </div>

    )
}
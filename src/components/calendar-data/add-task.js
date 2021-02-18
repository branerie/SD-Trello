import React, { useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useSocket } from '../../contexts/SocketProvider'
import { useHistory } from 'react-router-dom'

export default function AddTask({ listId, project, handleInputRemove }) {
    const inputRef = useRef(null)
    const [taskName, setTaskName] = useState('')
    const [nameHeight, setNameHeight] = useState(null)
    const socket = useSocket()
    const history = useHistory()

    const handleSubmit = async () => {
        if (!taskName) {
            return handleInputRemove()
        }

        const token = getCookie('x-auth-token')
        const response = await fetch(`/api/projects/lists/cards/${listId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                name: taskName,
                progress: ''
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }
            
        // const updatedCard = await response.json()
        socket.emit('project-update', project)

        handleInputRemove()
    }

    const handleChange = (event) => {
        setTaskName(event.target.value)
        setNameHeight(inputRef.current.scrollHeight + 2)
    }

    const handleKeyDown = (event) => {
        const ESCAPE_KEY_CODE = 27
        if (event.keyCode === ESCAPE_KEY_CODE) {
            return handleInputRemove()
        }

        const ENTER_KEY_CODE = 13
        if (event.keyCode === ENTER_KEY_CODE) {
            return handleSubmit()
        }
    }

    return (
        <textarea
            value={taskName}
            ref={inputRef}
            placeholder='Enter new task name:'
            className={styles.inputTaskName}
            style={{ 'height': nameHeight, width: '100%' }}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onBlur={handleSubmit}
            autoFocus
        />
    )
}
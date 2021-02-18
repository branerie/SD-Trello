import React, { useCallback, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'

export default function AddList({ project, handleInputRemove }) {
    const history = useHistory()     
    const [listName, setListName] = useState('')
    const [nameHeight, setNameHeight] = useState(null)
    const inputRef = useRef(null)
    const socket = useSocket()


    const handleSubmit = useCallback(async () => {
        const projectId = project._id
        if (!listName) {
            return handleInputRemove()
        }

        const token = getCookie('x-auth-token')
        const response = await fetch(`/api/projects/lists/${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ name: listName })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        socket.emit('project-update', project)
        handleInputRemove()
            
    }, [history, listName, project._id])

    const handleChange = (event) => {
        setListName(event.target.value)
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
            value={listName}
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

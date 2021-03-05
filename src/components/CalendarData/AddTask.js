import React, { useState } from 'react'
import getCookie from '../../utils/cookie'
import { useSocket } from '../../contexts/SocketProvider'
import { useHistory } from 'react-router-dom'
import AddProjectElement from './AddProjectElement'

export default function AddTask({ listId, project, handleInputRemove }) {
    const [taskName, setTaskName] = useState('')
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

    return (
        <AddProjectElement
            elementName={taskName}
            setElementName={setTaskName}
            handleSubmit={handleSubmit}
            handleInputRemove={handleInputRemove}
            placeholder='Enter new task name:'
        />
    )
}
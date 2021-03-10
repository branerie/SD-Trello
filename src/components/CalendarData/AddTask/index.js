import React, { useState } from 'react'
import { useSocket } from '../../../contexts/SocketProvider'
import useCardsServices from '../../../services/useCardsServices'
import AddProjectElement from '../AddProjectElement'

export default function AddTask({ listId, project, handleInputRemove }) {
    const [taskName, setTaskName] = useState('')
    const socket = useSocket()
    const { createTask } = useCardsServices()

    const handleSubmit = async () => {
        if (!taskName) {
            return handleInputRemove()
        }

        await createTask(listId, taskName)
            
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
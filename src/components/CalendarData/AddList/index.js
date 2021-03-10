import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../../contexts/SocketProvider'
import getCookie from '../../../utils/cookie'
import AddProjectElement from '../AddProjectElement'

export default function AddList({ project, handleInputRemove }) {
    const [listName, setListName] = useState('')
    const socket = useSocket()
    const history = useHistory()     


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
            
    }, [history, listName, project, handleInputRemove, socket])

    return (
        <AddProjectElement
            elementName={listName}
            setElementName={setListName}
            handleSubmit={handleSubmit}
            handleInputRemove={handleInputRemove}
            placeholder='Enter new list name:'
        />
    )
}

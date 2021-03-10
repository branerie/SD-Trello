import { useHistory } from 'react-router'
import getCookie from '../utils/cookie'

const CARDS_URL = '/api/projects/lists/cards'

export default function useCardsServices() {
    const history = useHistory()

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': getCookie('x-auth-token')
        }
    }

    const createTask = async (listId, taskName) => {
        const response = await fetch(`${CARDS_URL}/${listId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                name: taskName,
                progress: ''
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const editTask = async (listId, cardId, editedFields) => {
        const response = await fetch(`${CARDS_URL}/${listId}/${cardId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(editedFields)
        })
        
        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }
    
    const deleteTask = async (listId, cardId) => {
        const response = await fetch(`${CARDS_URL}/${listId}/${cardId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        
        if (!response.ok) {
            history.push('/error')
            return
        }
        
        return await response.json()
    }

    const addTaskMember = async (listId, cardId, members, selectedUser, teamId, projectId) => {
        const response = await fetch(`${CARDS_URL}/${listId}/${cardId}/add-member`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                members,
                newMember: selectedUser,
                teamId,
                projectId,
                cardId,
                listId
            })
        })
        
        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const addAttachment = async (cardId, attachment) => {
        const response = await fetch(`${CARDS_URL}/attachments/${cardId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                attachment
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const removeAttachment = async (cardId, attachmentId) => {
        const response = await fetch(`${CARDS_URL}/attachments/${cardId}/${attachmentId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    return {
        createTask,
        editTask,
        deleteTask,
        addTaskMember,
        addAttachment,
        removeAttachment
    }
}
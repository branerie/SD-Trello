import { useHistory } from 'react-router'
import getCookie from '../utils/cookie'

const LISTS_URL = '/api/projects/lists'

export default function useListsServices() {
    const history = useHistory()

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': getCookie('x-auth-token')
        }
    }

    const createList = async (projectId, listName) => {
        const response = await fetch(`${LISTS_URL}/${projectId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ name: listName })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const editList = async (projectId, listId, name, color) => {
        const response = await fetch(`${LISTS_URL}/${projectId}/${listId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ name, color })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const deleteList = async (projectId, listId) => {
        const response = await fetch(`${LISTS_URL}/${projectId}/${listId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const dragAndDropList = async (projectId, listId, position) => {
        const response = await fetch(`${LISTS_URL}/${projectId}/${listId}/dnd-list`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                position,
                element: 'list',
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const dragAndDropCard = async (projectId, cardId, position, source, destination) => {
        const response = await fetch(`${LISTS_URL}/${projectId}/${cardId}/dnd-card`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                position,
                element: 'card',
                source,
                destination
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }
    }

    return {
        createList,
        editList,
        deleteList,
        dragAndDropList,
        dragAndDropCard
    }
}
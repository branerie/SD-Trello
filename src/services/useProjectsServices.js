import { useCallback } from 'react'
import { useHistory } from 'react-router'
import getCookie from '../utils/cookie'

const PROJECTS_URL = '/api/projects'

export default function useProjectsServices() {
    const history = useHistory()

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': getCookie('x-auth-token')
        }
    }

    const getProjectInfo = useCallback(async (projectId) => {
        const response = await fetch(`${PROJECTS_URL}/info/${projectId}`, {
            method: 'GET',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])

    const createProject = useCallback(async (name, description, teamId, members) => {
        const response = await fetch(`${PROJECTS_URL}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                name,
                description,
                teamId,
                members
            })
        })
        
        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])

    const editProject = useCallback(async (projectId, name, description, isFinished) => {
        const response = await fetch(`${PROJECTS_URL}/${projectId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                name,
                description,
                isFinished
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])

    const deleteProject = useCallback(async (projectId) => {
        const response = await fetch(`${PROJECTS_URL}/${projectId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])

    const changeUserRole = useCallback(async (projectId, memberRoleId, memberAdmin) => {
        const response = await fetch(`${PROJECTS_URL}/${projectId}/user-roles`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                userRole: memberRoleId,
                isAdmin: !memberAdmin
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])
    
    const addProjectMember = useCallback(async (projectId, member) => {
        const response = await fetch(`${PROJECTS_URL}/${projectId}/user`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                member,
                admin: false
            })
        })
        
        if (!response.ok) {
            history.push('/error')
            return
        }
        
        return await response.json()
    }, [history])

    const removeProjectMember = useCallback(async (projectId, memberId) => {
        const response = await fetch(`${PROJECTS_URL}/${projectId}/user-remove`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                memberId
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])

    return {
        getProjectInfo,
        createProject,
        editProject,
        deleteProject,
        changeUserRole,
        addProjectMember,
        removeProjectMember
    }
}
import { useHistory } from 'react-router'
import getCookie from "../utils/cookie"

const PROJECTS_URL = '/api/projects'

export default function useProjectsServices() {
    const history = useHistory()

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': getCookie('x-auth-token')
        }
    }

    const getProjectInfo = async (projectId) => {
        const response = await fetch(`${PROJECTS_URL}/info/${projectId}`, {
            method: 'GET',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const editProject = async (projectId, name, description, isFinished) => {
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
    }

    const deleteProject = async (projectId) => {
        const response = await fetch(`${PROJECTS_URL}/${projectId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }

    const changeUserRole = async (projectId, memberRoleId, memberAdmin) => {
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
    }
    
    const addProjectMember = async (projectId, member) => {
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
    }

    const removeProjectMember = async (projectId, memberId) => {
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
    }

    return {
        getProjectInfo,
        editProject,
        deleteProject,
        changeUserRole,
        addProjectMember,
        removeProjectMember
    }

}
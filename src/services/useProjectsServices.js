import { useHistory } from 'react-router'
import getCookie from "../utils/cookie"

const PROJECTS_URL = '/api/projects'

export default function useProjectsServices() {
    const history = useHistory()
    const token = getCookie('x-auth-token')

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': token
        }
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

    const removeProjectMember = async (projectId, memberId) => {
        const response = await fetch(`${PROJECTS_URL}/${projectId}/user-remove`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                memberId
            })
        })

        if (!response.ok) {
            history.push("/error")
            return
        }

        return await response.json()
    }

    return {
        changeUserRole,
        removeProjectMember
    }

}
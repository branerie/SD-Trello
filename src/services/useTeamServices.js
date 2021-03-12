import { useHistory } from 'react-router'
import getCookie from '../utils/cookie'

const TEAMS_URL = '/api/teams'

export default function useTeamServices() {
    const history = useHistory()

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': getCookie('x-auth-token')
        }
    }

    const getTeamUsers = async (currentTeamId) => {
        const response = await fetch(`${TEAMS_URL}/get-users/${currentTeamId}`, {
            method: 'GET',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
        }
        const data = await response.json()
        return data
    }

    const createTeam = async (name, description, requests) => {
        const response = await fetch(`${TEAMS_URL}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                name,
                description,
                requests
            })
        })
        if (!response.ok) {
            history.push('/error')
            return
        }
        const team = await response.json()
        return team
    }

    const updateTeam = async (teamId, name, description, members, requests) => {

        const response = await fetch(`${TEAMS_URL}/${teamId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                name,
                description,
                members,
                requests
            })
        })
        if (!response.ok) {
            history.push('/error')
            return
        }
        const updatedTeam = await response.json()
        return updatedTeam
    }

    const removeTeamInvitations = async (teamId, removeInvitation) => {

        const response = await fetch(`${TEAMS_URL}/removeInvitations/${teamId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ removeInvitation })
        })
        if (!response.ok) {
            history.push('/error')
            return
        }
        console.log('success');
    }

    const deleteTeam = async (teamId) => {
        const response = await fetch(`${TEAMS_URL}/${teamId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        if (!response.ok) {
            history.push('/error')
        }
        const deletedTeam = await response.json()
        return deletedTeam
    }

    const teamInvitations = async (teamId, message, accepted) => {
        const response = await fetch(`${TEAMS_URL}/invitations/${teamId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                message,
                accepted
            })
        })
        if (!response.ok) {
            history.push('/error')
            return
        }
        const user = await response.json()
        return user
    }

    const getTeamInvitationInfo = async (teamId) => {
        const response = await fetch(`${TEAMS_URL}/${teamId}`, {
            method: 'GET',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        const team = await response.json()
        return team
    }

    const getUserTeams = async () => {
        const promise = await fetch(`${TEAMS_URL}`, {
            method: 'GET',
            headers: getHeaders()
        })

        const response = await promise.json()
        return response
    }



    return {
        getTeamUsers,
        createTeam,
        updateTeam,
        removeTeamInvitations,
        deleteTeam,
        teamInvitations,
        getTeamInvitationInfo,
        getUserTeams
    }
}
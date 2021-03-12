import { useCallback } from 'react'
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

    const getTeamUsers = useCallback(async (currentTeamId) => {
        const response = await fetch(`${TEAMS_URL}/get-users/${currentTeamId}`, {
            method: 'GET',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
        }
        const data = await response.json()
        return data
    },[history])

    const createTeam = useCallback(async (name, description, requests) => {
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
    },[history])

    const updateTeam = useCallback(async (teamId, name, description, members, requests) => {

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
    },[history])

    const removeTeamInvitations = useCallback(async (teamId, removeInvitation) => {

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
    },[history])

    const deleteTeam = useCallback(async (teamId) => {
        const response = await fetch(`${TEAMS_URL}/${teamId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        if (!response.ok) {
            history.push('/error')
        }
        const deletedTeam = await response.json()
        return deletedTeam
    },[history])

    const teamInvitations = useCallback(async (teamId, message, accepted) => {
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
    },[history])

    const getTeamInvitationInfo = useCallback(async (teamId) => {
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
    },[history])

    const getUserTeams = useCallback(async () => {
        const promise = await fetch(`${TEAMS_URL}`, {
            method: 'GET',
            headers: getHeaders()
        })
        if (!promise.ok) {
            history.push('/error')
            return
        }
        const response = await promise.json()
        return response
    },[history])



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
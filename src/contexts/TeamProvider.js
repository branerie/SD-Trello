import React, { useState, useEffect, useContext, useCallback } from 'react'
import useTeamServices from '../services/useTeamServices'
import { useSocket } from './SocketProvider'
import TeamContext from './TeamContext'
import UserContext from './UserContext'

function TeamProvider({ children }) {
    const [teams, setTeams] = useState([])
    const [selectedTeam, setSelectedTeam] = useState('Select')
    const [currentProjects, setCurrentProjects] = useState([])
    const userContext = useContext(UserContext)
    const socket = useSocket()
    const { getUserTeams } = useTeamServices()


    function getCurrentProjects(teamId) {
        const current = teams.find(t => t._id === teamId)
        if (current) {
            setCurrentProjects(current.projects)
        }
    }


    function updateSelectedTeam(teamId) {
        const current = teams.find(t => t._id === teamId)
        if (current) {
            setSelectedTeam(current.name)
        }
    }

    useEffect(() => {
        setTeams(userContext.user.teams)
    }, [userContext.user.teams])

    const teamUpdate = useCallback(async () => {
        const response = await getUserTeams()

        setTeams(response.teams)

        userContext.logIn(response)

    }, [userContext, getUserTeams])

    useEffect(() => {
        if (socket == null) return
        socket.on('team-updated', teamUpdate)
        return () => socket.off('team-updated')
    }, [socket, teamUpdate])

    return (
        <TeamContext.Provider value={{
            teams,
            setTeams,
            selectedTeam,
            setSelectedTeam,
            currentProjects,
            setCurrentProjects,
            getCurrentProjects,
            updateSelectedTeam
        }}>
            {children}
        </TeamContext.Provider>
    )
}

export default TeamProvider

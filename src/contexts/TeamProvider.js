import React, { useState, useEffect, useContext, useCallback } from 'react'
import getCookie from '../utils/cookie'
import userObject from '../utils/userObject'
import { useSocket } from './SocketProvider'
import TeamContext from './TeamContext'
import UserContext from './UserContext'

function TeamProvider({ children }) {
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('Select')
  const [currentProjects, setCurrentProjects] = useState([])
  const userContext = useContext(UserContext)
  const socket = useSocket()

  console.log(teams);

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
    const token = getCookie("x-auth-token")
    const promise = await fetch("/api/teams", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const response = await promise.json()

    setTeams(response.teams)
    console.log(response.teams);

    const user =  userObject(response)
    userContext.logIn(user)

  }, [userContext])

  useEffect(() => {
    if (socket == null) return
    socket.on('team-updated', teamUpdate)
    return () => socket.off('team-updated')
  }, [socket, teamUpdate])

  return (
    <TeamContext.Provider value={{ teams, setTeams, selectedTeam, setSelectedTeam, currentProjects, setCurrentProjects, getCurrentProjects, updateSelectedTeam }}>
      {children}
    </TeamContext.Provider>
  )
}

export default TeamProvider

import React, { useState, useEffect, useContext, useCallback } from 'react'
import getCookie from '../utils/cookie'
import { useSocket } from './SocketProvider'
import TeamContext from './TeamContext'
import UserContext from './UserContext'

function TeamProvider({ children }) {
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('Select')
  const [currentProjects, setCurrentProjects] = useState([])
  const userContext = useContext(UserContext)
  const socket = useSocket()

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

  async function getTeams() {
    if (userContext.user.teams) {
      setTeams(userContext.user.teams)
    }
  }

  useEffect(() => {
    getTeams()
  })

  const teamUpdate = useCallback((team) => {
    console.log('teamUpdateFunc', team);
    const token = getCookie("x-auth-token")

    fetch("/api/teams", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }).then(promise => {
      return promise.json()
    }).then(response => {
      console.log(response);
      setTeams(response)
      const user = {...userContext.user}
      user.teams = response
      userContext.setUser(user)
    })
  }, [userContext])

  useEffect(() => {
    if (socket == null) return
    socket.on('team-updated', teamUpdate)

    return () => socket.off('team-updated')
  }, [socket, teamUpdate])

  return (
    <TeamContext.Provider value={{ teams, setTeams, selectedTeam, setSelectedTeam, currentProjects, setCurrentProjects, getCurrentProjects, getTeams, updateSelectedTeam }}>
      {children}
    </TeamContext.Provider>
  )
}

export default TeamProvider

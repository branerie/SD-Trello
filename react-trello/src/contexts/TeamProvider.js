import React, { useState, useEffect, useContext } from 'react'
import TeamContext from './TeamContext'
import UserContext from './UserContext'

function TeamProvider({ children }) {
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('Select')
  const [currentProjects, setCurrentProjects] = useState([])
  const userContext = useContext(UserContext)

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

  return (
    <TeamContext.Provider value={{ teams, setTeams, selectedTeam, setSelectedTeam, currentProjects, setCurrentProjects, getCurrentProjects, getTeams, updateSelectedTeam }}>
      {children}
    </TeamContext.Provider>
  )
}

export default TeamProvider

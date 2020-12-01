import React, { useState, useEffect, useContext } from 'react'
import Loader from 'react-loader-spinner'
import TeamContext from './TeamContext'
import UserContext from './UserContext'

function TeamProvider({ children }) {
  const [teams, setTeams] = useState([])
  const [option, setOption] = useState('select')
  const [currentProjects, setCurrentProjects] = useState([])
  const userContext = useContext(UserContext)

  function getCurrentProjects(teamId) {
    const current = teams.find(t => t._id === teamId)
    if (current) {
      setCurrentProjects(current.projects)

    }
  }

  async function getTeams() {
    if (userContext.user.teams) {
      setTeams(userContext.user.teams)
    }
  }

  useEffect(() => {
    getTeams()
  }, [userContext.logIn])

  if (!teams) {
    return (
      <Loader
        type="TailSpin"
        color="#363338"
        height={100}
        width={100}
        timeout={3000} //3 secs
      />
    )
  }

  return (
    <TeamContext.Provider value={{ teams, setTeams, option, setOption, currentProjects, setCurrentProjects, getCurrentProjects, getTeams }}>
      {children}
    </TeamContext.Provider>
  )
}

export default TeamProvider

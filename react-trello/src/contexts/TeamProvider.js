import React, { useState, useEffect, useContext, useCallback } from 'react'
import Loader from 'react-loader-spinner'
import { useHistory } from 'react-router-dom'
import getCookie from '../utils/cookie'
import TeamContext from './TeamContext'
import UserContext from './UserContext'

function TeamProvider({ children }) {
  const [teams, setTeams] = useState([])
  const [option, setOption] = useState('select')
  const [currentProjects, setCurrentProjects] = useState([])

  const history = useHistory()
  const userContext = useContext(UserContext)

  console.log('teamprovider', option, teams, currentProjects);

  function getCurrentProjects(teamId) {
    console.log('team provider getCurrentProjects', teamId, teams);
    const current = teams.find(t => t._id === teamId)
    if (current) {
      setCurrentProjects(current.projects)

    }
    console.log(current);
  }



  async function getTeams() {
    console.log('getTeams from provider');
    console.log(userContext.user);
    const token = getCookie("x-auth-token")
    console.log(token);

    // const response = await fetch('http://localhost:4000/api/teams', {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": token
    //   }
    // })

    // console.log(response);
    // console.log(userContext.user.teams);

    //   if (!response.ok) {
    //   history.push("/error")
    // }
    // const data = await response.json()
    // console.log('getTeams', data);

    if (userContext.user.teams) {
      console.log(userContext.user.teams);

      setTeams(userContext.user.teams)

    }




  }

  useEffect(() => {
    console.log('useEffect from team provider');
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

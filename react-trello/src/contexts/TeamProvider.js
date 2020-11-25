import React, { useState, useEffect } from 'react'
import Loader from 'react-loader-spinner'
import { useHistory, useParams } from 'react-router-dom'
import getCookie from '../utils/cookie'
import TeamContext from './TeamContext'

function TeamProvider({ children }) {
  // const params = useParams()
  const [teams, setTeams] = useState([])
  const [option, setOption] = useState('select')
  const [currentTeam, setCurrentTeam] = useState({})
  const history = useHistory()

  async function getTeams() {
    const token = getCookie("x-auth-token")
    const response = await fetch('http://localhost:4000/api/teams', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    if (!response.ok) {
      history.push("/error")
    }
    const data = await response.json()
    setTeams(data)

    // console.log(params.teamId);

    // if (params.teamId) {
    //   const teamId = params.teamId
    //   const current = teams.find(t => t._id === teamId)
    //   setCurrentTeam(current)
    //   setOption(teamId)
    // }
  }

  useEffect(() => {
    getTeams()
  }, [])

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
    <TeamContext.Provider value={ { teams, setTeams, option, setOption, currentTeam, setCurrentTeam } }>
      {children}
    </TeamContext.Provider>
  )
}

export default TeamProvider

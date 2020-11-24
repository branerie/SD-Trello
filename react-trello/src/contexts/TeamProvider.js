import React, { useState, useEffect } from 'react'
import Loader from 'react-loader-spinner'
import { useHistory } from 'react-router-dom'
import getCookie from '../utils/cookie'
import TeamContext from './TeamContext'

async function TeamProvider({ children }) {
  const [teams, setTeams] = useState([])
  const history = useHistory()

  // async function getTeams() {
  //   const token = getCookie("x-auth-token")
  //   const response = await fetch('http://localhost:4000/api/teams', {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": token
  //     }
  //   })

  //   if (!response.ok) {
  //     history.push("/error")
  //   }
  //   const data = await response.json()

  //   setTeams(data)
  // }

  // useEffect(() => {
  //   setTeams()
  // }, [])

  // if (!teams) {
  //   return (
  //     <Loader
  //       type="TailSpin"
  //       color="#363338"
  //       height={100}
  //       width={100}
  //       timeout={3000} //3 secs
  //     />
  //   )
  // }

  return (
    <TeamContext.Provider value={ { teams, setTeams } }>
      {children}
    </TeamContext.Provider>
  )
}

export default TeamProvider

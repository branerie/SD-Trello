import React from 'react'

const TeamContext = React.createContext({
  teams: [] ,
  setTeams: () => {},
  option: [] ,
  setOption: () => {},
  currentTeam: [] ,
  setCurrentTeam: () => {}
})

export default TeamContext
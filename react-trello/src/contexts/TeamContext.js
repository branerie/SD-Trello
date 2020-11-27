import React from 'react'

const TeamContext = React.createContext({
  teams: [] ,
  setTeams: () => {},
  option: 'select' ,
  setOption: () => {},
  getCurrentTeam: () => {},
  currentTeam: '',
  setCurrentTeam: () => {},
  getTeams: () => {}
})

export default TeamContext
import React from 'react'

const TeamContext = React.createContext({
  teams: [] ,
  setTeams: () => {},
  selectedTeam: 'Select' ,
  setSelectedTeam: () => {},
  getCurrentTeam: () => {},
  currentTeam: '',
  setCurrentTeam: () => {},
  getTeams: () => {}
})

export default TeamContext
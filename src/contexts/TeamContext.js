import React from 'react'

const TeamContext = React.createContext({
  teams: [] ,
  setTeams: () => {},
  selectedTeam: 'Select' ,
  setSelectedTeam: () => {},
  getCurrentTeam: () => {},
  currentTeam: '',
  currentProjects: [],
  setCurrentTeam: () => {},
  getTeams: () => {},
  updateSelectedTeam: () => {},
  getCurrentProjects: () => {}
})

export default TeamContext
import React from 'react'

const TeamContext = React.createContext({
  teams: [] ,
  setTeams: () => {},
})

export default TeamContext
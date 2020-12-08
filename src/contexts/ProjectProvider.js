import React, { useState } from 'react'
import ProjectContext from './ProjectContext'

function ListProvider({ children }) {
  const [lists, setLists] = useState([])
  const [hiddenLists, setHiddenLists] = useState([])
  const [project, setProject] = useState(null)
  
  return (
    <ProjectContext.Provider value={ { lists, setLists, hiddenLists, setHiddenLists, project, setProject } }>
      {children}
    </ProjectContext.Provider>
  )
}

export default ListProvider

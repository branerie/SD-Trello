import React from 'react'

const ProjectContext = React.createContext({
  lists: [] ,
  setLists: () => {},
  hiddenLists: [],
  setHiddenLists: () => {},
  project: {},
  setProject: () => {}
})

export default ProjectContext

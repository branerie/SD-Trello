import React, { useState } from 'react'
import ProjectContext from './ProjectContext'

function ProjectProvider({ children }) {
    const [lists, setLists] = useState([])
    const [hiddenLists, setHiddenLists] = useState([])
    const [project, setProject] = useState(null)
    const [projectName, setProjectName] = useState('Select')

    return (
        <ProjectContext.Provider value={{ lists, setLists, hiddenLists, setHiddenLists, project, setProject, projectName, setProjectName }}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectProvider

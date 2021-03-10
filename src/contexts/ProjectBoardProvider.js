import React, { useContext, useState } from 'react'

const ProjectBoardContext = React.createContext()

const useProjectBoardContext = () => {
    return useContext(ProjectBoardContext)
}

const ProjectBoardProvider = ({ children }) => {
    const [lists, setLists] = useState([])

    return (
        <ProjectBoardContext.Provider value={{ lists, setLists }}>
            {children}
        </ProjectBoardContext.Provider>
    )
}

export {
    ProjectBoardProvider,
    useProjectBoardContext
}

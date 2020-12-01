import React from "react"
import UserProvider from "./contexts/UserProvider"
import ProjectProvider from "./contexts/ProjectProvider"

const App = (props) => {

    return (
        <UserProvider>
            {props.children}
        </UserProvider>
    )
}

export default App
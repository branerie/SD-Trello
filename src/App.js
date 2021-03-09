import React from 'react'
import UserProvider from './contexts/UserProvider'

const App = (props) => {

    return (
        <UserProvider>
            {props.children}
        </UserProvider>
    )
}

export default App
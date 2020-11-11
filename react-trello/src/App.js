import React, { useState, useEffect, useContext } from "react"
import UserContext from "./Context"
import { SocketProvider } from "./contexts/SocketProvider"
import getCookie from "./utils/cookie"

const App = (props) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const context = useContext(UserContext)


    const logIn = (user) => {
        setUser({
            ...user,
            loggedIn: true
        })
    }

    const logOut = () => {
        document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"

        setUser({
            loggedIn: false
        })
    }

    useEffect(() => {

        const token = getCookie("x-auth-token")

        if (!token) {
            logOut();
            setLoading(false)
            return;
        }

        fetch("http://localhost:4000/api/user/verify", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(promise => {
            return promise.json()
        }).then(response => {
            if (response.status) {
                logIn({
                    username: response.user.username,
                    id: response.user._id
                })
            } else {
                logOut()
            }

            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <UserContext.Provider value={{
            user,
            logIn,
            logOut
        }}>         
            <SocketProvider user={'context.user.username'}>
                {props.children}
            </SocketProvider>
        </UserContext.Provider>
    )
}

export default App
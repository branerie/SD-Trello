import React, { useState, useEffect, useCallback } from "react"
import Loader from "react-loader-spinner"
import { useHistory } from "react-router-dom"
import getCookie from "../utils/cookie"
import UserContext from "./UserContext"

const UserProvider = (props) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const history = useHistory()

    const logIn = (user) => {
        setUser({
            ...user,
            loggedIn: true
        })
    }

    const logOut = useCallback(() => {
        const token = getCookie("x-auth-token")
        fetch('http://localhost:4000/api/user/logout', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(response => {
            if (!response.ok) {
                history.push("/error")
            } else {
                document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;"

                setUser({
                    loggedIn: false
                })
            }
        })
    }, [history])

    function verifyLogin() {
        const token = getCookie("x-auth-token")

        if (!token) {

            setUser({
                loggedIn: false
            })

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
                    id: response.user._id,
                    teams: response.teams
                })
            } else {
                logOut()
            }

            setLoading(false)
        })
    }

    useEffect(() => {
        verifyLogin()
    }, [])
    
    if (loading) {
        return (
            <Loader
            type="TailSpin"
            color="#363338"
            height={100}
            width={100}
            timeout={3000} //3 secs
            />
        )
    }

    return (
        <UserContext.Provider value={{
            user,
            logIn,
            logOut
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider
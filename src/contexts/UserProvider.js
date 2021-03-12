import React, { useState, useEffect, useCallback } from 'react'
import Loader from 'react-loader-spinner'
import useUserServices from '../services/useUserServices'
import getCookie from '../utils/cookie'
import UserContext from './UserContext'

const UserProvider = (props) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { logoutUser, verifyLogin } = useUserServices()
    const token = getCookie('x-auth-token')


    const logIn = (response) => {
        const user = {
            username: response.user.username,
            id: response.user._id,
            teams: response.teams,
            inbox: response.user.inbox,
            confirmed: response.user.confirmed,
            newPasswordConfirmed: response.user.newPasswordConfirmed,
            recentProjects: response.user.recentProjects,
            image: response.user.image,
            lastTeamSelected: response.user.lastTeamSelected
        }

        setUser({
            ...user,
            loggedIn: true
        })
    }

    const logOut = useCallback(async () => {
        if (!token) {
            return
        }
        await logoutUser()
        setUser({
            loggedIn: false
        })
    }, [logoutUser, token])

    const handleVerifyLogin = useCallback(async () => {
        if (!loading) {
            return
        }
        if (!token) {
            setUser({
                loggedIn: false
            })
            setLoading(false)
            return
        }
        const response = await verifyLogin()
        if (response.status) {
            logIn(response)
        } else {
            logOut()
        }
        setLoading(false)
    }, [verifyLogin, logOut, loading, token])

    useEffect(() => {
        handleVerifyLogin()
    }, [handleVerifyLogin])

    if (loading) {
        return (
            <Loader
                type='TailSpin'
                color='#363338'
                height={100}
                width={100}
                timeout={3000} //3 secs
            />
        )
    }

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            logIn,
            logOut
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider
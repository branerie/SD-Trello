import { useCallback } from 'react'
import { useHistory } from 'react-router'
import getCookie from "../utils/cookie"
import userObject from '../utils/userObject'

const USER_URL = '/api/user'

export default function useUserServices() {
    const history = useHistory()


    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': getCookie('x-auth-token')
        }
    }

    const getUser = useCallback(async (userId) => {

        const response = await fetch(`${USER_URL}/${userId}`, {
            method: 'GET'
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])

    const getAllUsers = useCallback(async () => {
        const response = await fetch(`${USER_URL}/get-all`, {
            method: 'GET',
            headers: getHeaders()
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])

    const updateUser = useCallback(async (userId, username) => {

        const promise = await fetch(`${USER_URL}/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                username: username,
            })
        })

        if (!promise.ok) {
            history.push('/error')
            return
        }

        const response = await promise.json()
        if (response.user.username) {
            const user = userObject(response)
            return user
        }
    }, [history])

    const updateUserPassword = useCallback(async (userId, password) => {

        const promise = await fetch(`${USER_URL}/password/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                password: password
            })
        })

        if (!promise.ok) {
            history.push('/error')
            return
        }

        const response = await promise.json()
        if (response.user.username) {
            const user = userObject(response)
            return user
        }
    }, [history])

    const updateUserImage = useCallback(async (userId, newImage, oldImage) => {

        const promise = await fetch(`${USER_URL}/image/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                newImage,
                oldImage
            })
        })

        if (!promise.ok) {
            history.push('/error')
            return
        }

        const response = await promise.json()
        if (response.user.username) {
            const user = userObject(response)
            return user
        }
    }, [history])

    const addNewPassword = useCallback(async (userId, password) => {

        const promise = await fetch(`${USER_URL}/addNewPassword/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                password
            })
        })



        if (!promise.ok) {
            history.push('/error')
            return
        }

        const response = await promise.json()
        if (response.user.username) {
            const user = userObject(response)
            console.log(user);
            return user
        }
    }, [history])

    const userLogin = useCallback(async (email, password) => {

        const promise = await fetch(`${USER_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const authToken = promise.headers.get('Authorization')
        const response = await promise.json()

        if (response.needPassword) {
            return response
        }
        if (response.wrongPassword) {
            return response
        }
        if (response.wrongUser) {
            return response
        }
        if (response.exist) {
            return response
        }

        document.cookie = `x-auth-token=${authToken};path=/`


        if (response.user.username && authToken) {
            const user = userObject(response)
            return user
        }
        return response
    }, [])

    const moveMessageToHistory = useCallback(async (message) => {
        const response = await fetch('/api/user/inbox', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                message
            })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }
    }, [history])

    const deleteUserMessage = useCallback(async (message) => {
        const response = await fetch(`/api/user/message/${message._id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        })

        if (!response.ok) {
            history.push('/error')
            return
        }
        return await response.json()
    }, [history])

    const confirmToken = useCallback(async (token) => {

        const promise = await fetch(`${USER_URL}/confirmation`, {
            method: 'POST',
            body: JSON.stringify({
                token
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const authToken = promise.headers.get('Authorization')
        const response = await promise.json()


        console.log(response);
        document.cookie = `x-auth-token=${authToken};path=/`

        if (response.user.username && authToken) {
            const user = userObject(response)
            return user
        }
    }, [])

    const registerUser = useCallback(async (email, username, password) => {

        const promise = await fetch(`${USER_URL}/register`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const authToken = promise.headers.get('Authorization')
        const response = await promise.json()

        if (response.exist) {
            return response
        }

        document.cookie = `x-auth-token=${authToken};path=/`


        if (response.user.username && authToken) {
            const user = userObject(response)
            return user
        }
        return response
    }, [])

    const logoutUser = useCallback(async () => {

        const response = await fetch(`${USER_URL}/logout`, {
            method: 'POST',
            headers: getHeaders()
        })
        if (!response.ok) {
            history.push('/error')
        } else {
            document.cookie = 'x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;'

            return response
        }
    }, [history])

    const verifyLogin = useCallback(async () => {
        const response = await fetch(`${USER_URL}/verify`, {
            method: 'GET',
            headers: getHeaders()
        })
        if (!response.ok) {
            history.push('/error')
        }
        return await response.json()
    }, [history])

    const getUserInbox = useCallback(async () => {
        const response = await fetch(`${USER_URL}/inbox`, {
            method: 'GET',
            headers: getHeaders()
        })
        if (!response.ok) {
            history.push('/error')
            return
        }

        const user = await response.json()
        return user

    }, [history])

    const getUserTasks = useCallback(async (teamId) => {
        const response = await fetch(`${USER_URL}/tasks/${teamId}`, {
            method: 'GET',
            headers: getHeaders()
        })
        if (!response.ok) {
            history.push('/error')
        }
        const data = await response.json()
        return data
    }, [history])
    
    const updateRecentProjects = useCallback(async (userId, recentProjects) => {
        const response = await fetch(`${USER_URL}/recentProjects/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ recentProjects })
        })

        if (!response.ok) {
            history.push('/error')
            return
        }

        return await response.json()
    }, [history])

    return {
        getUser,
        getAllUsers,
        updateUser,
        updateUserPassword,
        updateUserImage,
        addNewPassword,
        userLogin,
        moveMessageToHistory,
        deleteUserMessage,
        confirmToken,
        registerUser,
        logoutUser,
        verifyLogin,
        getUserInbox,
        getUserTasks,
        updateRecentProjects
    }

}






import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ user, children }) {
    const [socket, setSocket] = useState()
    const url = window.location.href.includes('heroku') ? '/' : 'http://localhost:4000'

    useEffect(() => {
        if (!user) {
            return
        }

        if (!user.teams) {
            return
        }

        const { username } = user
        const userId = user.id
        const teams = [...user.teams]
        const teamsId = teams.map(t => t._id)
        const teamsStr = JSON.stringify(teamsId)
        const newSocket = io(
            url, {
                query: { teamsStr, username, userId },
                transports: ['websocket']
            }
        )
        setSocket(newSocket)

        return () => newSocket.close()
    }, [user, url])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ user, children }) {
  const [socket, setSocket] = useState()
  const url = process.env.PORT ? '/' : 'http://localhost:4000'
  
  useEffect(() => {
    if (!user) {
      return
    }

    if (!user.teams) {
      return
    }
    const username = user.username
    const teams = [...user.teams]
    const teamsId = teams.map( t => t._id)
    const teamsStr = JSON.stringify(teamsId)
    const newSocket = io(
      url, {
        query: { teamsStr, username },
        transports: ['websocket']
      }
    )
    setSocket(newSocket)

    return () => newSocket.close()
  }, [user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

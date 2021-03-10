import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import useUserServices from '../../services/useUserServices'
import getCookie from '../../utils/cookie'

export default function useInboxUtils() {
    const history = useHistory()
    const socket = useSocket()
    const token = getCookie('x-auth-token')
    const params = useParams()
    const userId = params.userid
    const [isMoveActive, setIsMoveActive] = useState(false)  //If move message is invoked this state is set to true and doesn`t allow to move it again
    const { moveMessageToHistory, deleteUserMessage } = useUserServices()

    
    return {

        moveToHistory: async function (message) {
            if (isMoveActive) return
            setIsMoveActive(true)

            await moveMessageToHistory(message)            

            socket.emit('message-sent', userId)
        },

        deleteMessage: async function (message, setInboxHistory) {
            
            const user = await deleteUserMessage(message)

            setInboxHistory(user.inboxHistory)
        },

        viewTeam: async function viewTeam(message, setCurrTeam, setShowEditTeamForm) {
            const response = await fetch(`/api/teams/${message.team.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })

            if (!response.ok) {
                history.push('/error')
                return
            }

            const team = await response.json()
            setCurrTeam(team)
            setShowEditTeamForm(true)
        }

    }

}

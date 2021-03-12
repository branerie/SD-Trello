import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import useTeamServices from '../../services/useTeamServices'
import useUserServices from '../../services/useUserServices'

export default function useInboxUtils() {
    const socket = useSocket()
    const params = useParams()
    const userId = params.userid
    const [isMoveActive, setIsMoveActive] = useState(false)  //If move message is invoked this state is set to true and doesn`t allow to move it again
    const { moveMessageToHistory, deleteUserMessage } = useUserServices()
    const { getTeamInvitationInfo } = useTeamServices()



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
            const team = await getTeamInvitationInfo(message.team.id)

            setCurrTeam(team)
            
            setShowEditTeamForm(true)
        }

    }

}

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../../../contexts/SocketProvider'
import useTeamServices from '../../../services/useTeamServices'
import useUserServices from '../../../services/useUserServices'

const useInboxUtils = () => {
    const socket = useSocket()
    const { userid : userId  } = useParams()
    const [isMoveActive, setIsMoveActive] = useState(false)  //If move message is invoked this state is set to true and doesn`t allow to move it again
    const { moveMessageToHistory, deleteUserMessage } = useUserServices()
    const { getTeamInvitationInfo, teamInvitations } = useTeamServices()



    return {

        moveToHistory: async (message) => {
            if (isMoveActive) return

            setIsMoveActive(true)

            await moveMessageToHistory(message)

            socket.emit('message-sent', userId)
        },

        deleteMessage: async (message, setInboxHistory) => {

            const user = await deleteUserMessage(message)

            setInboxHistory(user.inboxHistory.reverse())
        },

        viewTeam: async (message, setCurrTeam, setShowEditTeamForm) => {

            const team = await getTeamInvitationInfo(message.team.id)

            setCurrTeam(team)
            setShowEditTeamForm(true)
        },

        responseInvitation: async (message, accepted, setInbox, setInboxHistory) => {

            const user = await teamInvitations(message.team.id, message, accepted)

            socket.emit('team-update', message.team.id)
            setInbox(user.inbox.reverse())
            setInboxHistory(user.inboxHistory.reverse())
            socket.emit('message-sent', userId)
            socket.emit('message-sent', message.sendFrom._id)
        }

    }

}

export default useInboxUtils
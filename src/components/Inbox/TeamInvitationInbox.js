import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import useTeamServices from '../../services/useTeamServices'
import ButtonGrey from '../ButtonGrey'
import EditTeam from '../EditTeam'
import Transparent from '../Transparent'
import styles from './index.module.css'
import useInboxUtils from './useInboxUtils'

export default function TeamInvitationInbox({ message, setInbox, setInboxHistory, options }) {
    const [showEditTeamForm, setShowEditTeamForm] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
    const socket = useSocket()
    const params = useParams()
    const userId = params.userid
    const utils = useInboxUtils()
    const { teamInvitations } = useTeamServices()

    async function acceptInvitation(message, accepted) {
        const user = await teamInvitations(message.team.id, message, accepted)
        socket.emit('team-update', message.team.id)
        setInbox(user.inbox)
        setInboxHistory(user.inboxHistory)
        socket.emit('message-sent', userId)
        socket.emit('message-sent', message.sendFrom._id)
    }

    return (

        <div className={styles.message}>
            <div className={styles.container}>
                <div className={styles.bold}>{message.subject}</div>
                <div>{new Date(message.createdAt).toLocaleDateString('en-US', options)}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Team name:</div>
                <div className={styles.inline}>{message.team.name}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Invited by:</div>
                <div className={styles.inline}>{message.sendFrom.username}</div>
            </div>
            {
                message.team.isDeleted ?
                    <div>
                        <div className={styles.bold}>Team deleted</div>
                        <ButtonGrey
                            className={styles.button}
                            onClick={() => utils.moveToHistory(message)}
                            title='Move to History'
                        />
                    </div> :
                    <div>
                        <ButtonGrey
                            className={styles.button}
                            onClick={() => acceptInvitation(message, true)}
                            title='Accept'
                        />
                        <ButtonGrey
                            className={styles.button}
                            onClick={() => acceptInvitation(message, false)}
                            title='Decline'
                        />
                        <ButtonGrey
                            className={styles.button}
                            onClick={() => utils.viewTeam(message, setCurrTeam, setShowEditTeamForm)}
                            title='View Team'
                        />
                    </div>
            }

            {
                showEditTeamForm &&
                <Transparent hideForm={() => setShowEditTeamForm(false)}>
                    <EditTeam currTeam={currTeam} isMessage={true} hideForm={() => { setShowEditTeamForm(false) }} />
                </Transparent>
            }
        </div>

    )
}

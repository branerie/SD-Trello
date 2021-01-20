import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import Button from '../button'
import EditTeam from '../edit-team'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function TeamInvitation({ message, setInbox, setInboxHistory, options }) {
    const [showEditTeamForm, setShowEditTeamForm] = useState(false)
    const history = useHistory()
    const token = getCookie("x-auth-token")
    const socket = useSocket()
    const params = useParams()
    const userId = params.userid

    async function acceptInvitation(message, accepted) {
        const response = await fetch(`/api/teams/invitations/${message.team._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                message,
                accepted
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const user = await response.json()
            socket.emit('team-update', message.team._id)
            setInbox(user.inbox)
            setInboxHistory(user.inboxHistory)
            if (accepted) {
                history.push(`/team/${message.teamId}`)
            }
            socket.emit('message-sent', userId)
            socket.emit('message-sent', message.sendFrom._id)
        }
    }

    return (
        <div className={styles.message}>
            <div className={styles.container}>
                <div className={styles.bold}>{message.subject}</div>
                <div>{new Date(message.createdAt).toLocaleDateString("en-US", options)}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Team name:</div>
                <div className={styles.inline}>{message.team.name}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Invited by:</div>
                <div className={styles.inline}>{message.sendFrom.username}</div>
            </div>
            <div>
                <Button
                    className={styles.button}
                    onClick={() => acceptInvitation(message, true)}
                    title='Accept'
                />
                <Button
                    className={styles.button}
                    onClick={() => acceptInvitation(message, false)}
                    title='Decline'
                />
                <Button
                    className={styles.button}
                    onClick={() => setShowEditTeamForm(true)}
                    title='View Team'
                />
                {
                    showEditTeamForm &&
                    (<Transparent hideForm={() => setShowEditTeamForm(false)}>
                        <EditTeam currTeam={message.team} hideForm={() => { setShowEditTeamForm(false) }} />
                    </Transparent>)
                }
            </div>
        </div>
    )
}

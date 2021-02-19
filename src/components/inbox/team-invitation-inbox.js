import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import Button from '../button'
import EditTeam from '../edit-team'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function TeamInvitationInbox({ message, setInbox, setInboxHistory, options }) {
    const [showEditTeamForm, setShowEditTeamForm] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
    const history = useHistory()
    const token = getCookie("x-auth-token")
    const socket = useSocket()
    const params = useParams()
    const userId = params.userid

    async function acceptInvitation(message, accepted) {
        const response = await fetch(`/api/teams/invitations/${message.team.id}`, {
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
            socket.emit('team-update', message.team.id)
            setInbox(user.inbox)
            setInboxHistory(user.inboxHistory)
            socket.emit('message-sent', userId)
            socket.emit('message-sent', message.sendFrom._id)
        }
    }

    async function moveToHistory() {
        const response = await fetch('/api/user/inbox', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                message
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            await response.json()
            socket.emit('message-sent', userId)
        }
    }

    async function viewTeam() {

        const response = await fetch(`/api/teams/${message.team.id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const team = await response.json()
            setCurrTeam(team)
        }
        setShowEditTeamForm(true)
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
            {
                message.team.isDeleted ?
                    <div>
                        <div className={styles.bold}>Team deleted</div>
                        <Button
                            className={styles.button}
                            onClick={moveToHistory}
                            title='Move to History'
                        />
                    </div> :
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
                            onClick={viewTeam}
                            title='View Team'
                        />
                    </div>
            }

            {
                showEditTeamForm &&
                <Transparent hideForm={() => setShowEditTeamForm(false)}>
                    <EditTeam currTeam={currTeam} hideForm={() => { setShowEditTeamForm(false) }} />
                </Transparent>
            }
        </div>
        
    )
}

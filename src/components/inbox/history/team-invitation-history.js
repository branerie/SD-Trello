import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import getCookie from '../../../utils/cookie'
import Button from '../../button'
import EditTeam from '../../edit-team'
import Transparent from '../../transparent'
import styles from './index.module.css'

export default function TeamInvitationHistory({ message, options, setInboxHistory }) {
    const [showEditTeamForm, setShowEditTeamForm] = useState(false)
    const history = useHistory()

    async function deleteMessage() {
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/user/message/${message._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const user = await response.json()
            setInboxHistory(user.inboxHistory)
        }
    }

    return (
        <div className={styles.message}>
            <div className={styles.container}>
                <div className={styles.container}>
                    <div className={styles.bold}>{message.subject}:</div>
                    {message.accepted ? <div>Accepted</div> : <div>Declined</div>}
                </div>
                <div>{new Date(message.createdAt).toLocaleDateString("en-US", options)}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Team name:</div>
                <div className={styles.inline}>{message.team.name}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Invited by:</div>
                <div className={styles.inline}>{message.invitedBy.username}</div>
            </div>
            <div>
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
                <Button
                    className={styles.button}
                    onClick={() => { if (window.confirm('Are you sure you wish to delete this message?')) deleteMessage() }}
                    title='Delete Message'
                />
            </div>
        </div>
    )
}

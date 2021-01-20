import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import Button from '../button'

import styles from './index.module.css'

export default function TeamInvitationResponse({ message, setInboxHistory, options, isInbox }) {
    const history = useHistory()
    const token = getCookie("x-auth-token")
    const socket = useSocket()
    const params = useParams()
    const userId = params.userid

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
                    <span>{message.sendFrom.username}{message.accepted ? <span> accepted</span> : <span> declined</span>}</span>
                </div>
                <div>{new Date(message.createdAt).toLocaleDateString("en-US", options)}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Team name:</div>
                <div className={styles.inline}>{message.team.name}</div>
            </div>
            <div>
                {
                    isInbox &&
                    <Button
                        className={styles.button}
                        onClick={moveToHistory}
                        title='Move to History'
                    />
                }
                {
                    !isInbox &&
                    <Button
                    className={styles.button}
                    onClick={() => { if (window.confirm('Are you sure you wish to delete this message?')) deleteMessage(message) }}
                    title='Delete Message'
                />
                }
            </div>
        </div>
    )
}

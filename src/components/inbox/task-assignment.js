import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import ButtonGrey from '../button-grey'
import ConfirmDialog from '../confirmation-dialog'

import styles from './index.module.css'

export default function TaskAssignment({ message, setInboxHistory, options, isInbox }) {
    const history = useHistory()
    const token = getCookie("x-auth-token")
    const socket = useSocket()
    const params = useParams()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currElement, setCurrElement] = useState('')
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
        <>
        {confirmOpen &&
            <ConfirmDialog
                title='delete this message'
                hideConfirm={() => setConfirmOpen(false)}
                onConfirm={() => deleteMessage(currElement)}
            />
        }
        <div className={styles.message}>
            <div className={styles.container}>
                <div className={styles.bold}>{message.subject}</div>
                <div>{new Date(message.createdAt).toLocaleDateString("en-US", options)}</div>
            </div>
            <div>

                {/* <div className={`${styles.bold} ${styles.inline}`}>Project:</div> */}
                <div className={`${styles.inline} ${styles.margin}`}><span className={styles.bold}>Project:</span>{message.project.name}</div>
                {/* <div className={`${styles.bold} ${styles.inline}`}>List:</div> */}
                <div className={`${styles.inline} ${styles.margin}`}><span className={styles.bold}>List:</span>{message.list.name}</div>
                {/* <div className={`${styles.bold} ${styles.inline}`}>Task:</div> */}
                <div className={`${styles.inline} ${styles.margin}`}><span className={styles.bold}>Task:</span>{message.card.name}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Assigned by:</div>
                <div className={styles.inline}>{message.sendFrom.username}</div>
            </div>
            {
                (message.team.isDeleted || message.project.isDeleted) &&
                <div className={styles.bold}>Project deleted</div>
            }
            <div>
                {
                    !message.team.isDeleted && !message.project.isDeleted &&
                    <ButtonGrey
                        className={styles.button}
                        onClick={() => history.push(`/project-board/${message.team.id}/${message.project.id}`)}
                        title='Go to Project'
                    />
                }
                {
                    isInbox ?
                    <ButtonGrey
                        className={styles.button}
                        onClick={moveToHistory}
                        title='Move to History'
                    /> :
                    <ButtonGrey
                        className={styles.button}
                        onClick={() => {
                            setConfirmOpen(true)                            
                            setCurrElement(message)
                        }} 
                        title='Delete Message'
                    />
                }
            </div>
        </div>
        </>
    )
}

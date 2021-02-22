import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import ButtonGrey from '../button-grey'
import ConfirmDialog from '../confirmation-dialog'
import EditTeam from '../edit-team'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function TeamInvitationCanceled({ message, setInboxHistory, options, isInbox }) {
    const [showEditTeamForm, setShowEditTeamForm] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
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

    async function deleteMessage() {
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
                <div className={`${styles.bold} ${styles.inline}`}>Team name:</div>
                <div className={styles.inline}>{message.team.name}</div>
            </div>
            <div>
                <div className={`${styles.bold} ${styles.inline}`}>Invited by:</div>
                <div className={styles.inline}>{message.sendFrom.username}</div>
            </div>
            {
                message.team.isDeleted &&
                <div className={styles.bold}>Team deleted</div>
            }
            {
                !message.team.isDeleted &&
                <ButtonGrey
                    className={styles.button}
                    onClick={viewTeam}
                    title='View Team'
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
            {
                showEditTeamForm &&
                <Transparent hideForm={() => setShowEditTeamForm(false)}>
                    <EditTeam currTeam={currTeam} hideForm={() => { setShowEditTeamForm(false) }} />
                </Transparent>
            }
        </div>
        </>
    )
}

import React, { useState } from 'react'
import Button from '../../button'
import EditTeam from '../../edit-team'
import Transparent from '../../transparent'
import styles from './index.module.css'

export default function TeamInvitationHistory({ message, options }) {
    const [showEditTeamForm, setShowEditTeamForm] = useState(false)

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
            </div>
        </div>
    )
}

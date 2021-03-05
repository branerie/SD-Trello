import React, { useState } from 'react'
import ButtonGrey from '../ButtonGrey'
import ConfirmDialog from '../ConfirmationDialog'
import EditTeam from '../EditTeam'
import Transparent from '../Transparent'
import styles from './index.module.css'
import useInboxUtils from './useInboxUtils'

export default function TeamInvitationHistory({ message, options, setInboxHistory }) {
    const [showEditTeamForm, setShowEditTeamForm] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
    const [confirmOpen, setConfirmOpen] = useState(false)
    const utils = useInboxUtils()

    return (
        <>
            {confirmOpen &&
                <ConfirmDialog
                    title='delete this message'
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={() => utils.deleteMessage(message, setInboxHistory)}
                />
            }
            <div className={styles.message}>
                <div className={styles.container}>
                    {message.accepted === undefined ?
                        <div className={styles.container}>
                            <div className={styles.bold}>{message.subject}</div>
                        </div> :
                        <div className={styles.container}>
                            <div className={styles.bold}>{message.subject}:</div>
                            {message.accepted ? <div>Accepted</div> : <div>Declined</div>}
                        </div>
                    }
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
                    <div className={`${styles.bold} ${styles.inline}`}>Team deleted</div>
                }
                <div>
                    {
                        !message.team.isDeleted &&
                        <ButtonGrey
                            className={styles.button}
                            onClick={() => utils.viewTeam(message, setCurrTeam, setShowEditTeamForm)}
                            title='View Team'
                        />
                    }
                    <ButtonGrey
                        className={styles.button}
                        onClick={() => setConfirmOpen(true)}
                        title='Delete Message'
                    />
                    {
                        showEditTeamForm &&
                        <Transparent hideForm={() => setShowEditTeamForm(false)}>
                            <EditTeam currTeam={currTeam} isMessage={true} hideForm={() => { setShowEditTeamForm(false) }} />
                        </Transparent>
                    }
                </div>
            </div>
        </>
    )
}

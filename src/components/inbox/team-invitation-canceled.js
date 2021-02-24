import React, { useState } from 'react'
import ButtonGrey from '../button-grey'
import ConfirmDialog from '../confirmation-dialog'
import EditTeam from '../edit-team'
import Transparent from '../transparent'
import styles from './index.module.css'
import useInboxUtils from './useInboxUtils'

export default function TeamInvitationCanceled({ message, setInboxHistory, options, isInbox }) {
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
                {!message.team.isDeleted &&
                    <ButtonGrey
                        className={styles.button}
                        onClick={() => utils.viewTeam(message, setCurrTeam, setShowEditTeamForm)}
                        title='View Team'
                    />
                }
                {isInbox ?
                    <ButtonGrey
                        className={styles.button}
                        onClick={() => utils.moveToHistory(message)}
                        title='Move to History'
                    /> :
                    <ButtonGrey
                        className={styles.button}
                        onClick={() => setConfirmOpen(true)}
                        title='Delete Message'
                    />
                }
                {showEditTeamForm &&
                    <Transparent hideForm={() => setShowEditTeamForm(false)}>
                        <EditTeam currTeam={currTeam} hideForm={() => { setShowEditTeamForm(false) }} />
                    </Transparent>
                }
            </div>
        </>
    )
}

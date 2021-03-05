import React, { useState } from 'react'
import ButtonGrey from '../ButtonGrey'
import ConfirmDialog from '../ConfirmationDialog'
import styles from './index.module.css'
import useInboxUtils from './useInboxUtils'

export default function TeamInvitationResponse({ message, setInboxHistory, options, isInbox }) {
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
                    <ButtonGrey
                        className={styles.button}
                        onClick={() => utils.moveToHistory(message)}
                        title='Move to History'
                    />
                }
                {
                    !isInbox &&
                    <ButtonGrey
                    className={styles.button}
                    onClick={() => setConfirmOpen(true)} 
                    title='Delete Message'
                />
                }
            </div>
        </div>
        </>
    )
}

import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import ButtonGrey from '../ButtonGrey'
import ConfirmDialog from '../ConfirmationDialog'
import styles from './index.module.css'
import useInboxUtils from './useInboxUtils'

export default function TaskAssignment({ message, setInboxHistory, options, isInbox }) {
    const history = useHistory()
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
                <div>{new Date(message.createdAt).toLocaleDateString('en-US', options)}</div>
            </div>
            <div>
                <div className={`${styles.inline} ${styles.margin}`}><span className={styles.bold}>Project:</span>{message.project.name}</div>
                <div className={`${styles.inline} ${styles.margin}`}><span className={styles.bold}>List:</span>{message.list.name}</div>
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
                        onClick={() => utils.moveToHistory(message)}
                        title='Move to History'
                    /> :
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

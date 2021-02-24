import React, { useState } from 'react'
import ButtonGrey from '../button-grey'
import ConfirmDialog from '../confirmation-dialog'
import styles from './index.module.css'
import useInboxUtils from './useInboxUtils'

export default function ProjectDeleted({ message, setInboxHistory, options, isInbox }) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const utils = useInboxUtils()

    return (
        <>
            { confirmOpen &&
                <ConfirmDialog
                    title='delete this message'
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={() => utils.deleteMessage(message, setInboxHistory)}
                />
            }
            <div className={styles.message}>
                <div className={styles.container}>
                    <div className={styles.container}>
                        <div className={styles.bold}>Project {message.project.name} deleted</div>
                    </div>
                    <div>{new Date(message.createdAt).toLocaleDateString("en-US", options)}</div>
                </div>
                <div>
                    <div className={`${styles.bold} ${styles.inline}`}>Deleted by:</div>
                    <div className={styles.inline}>{message.sendFrom.username}</div>
                </div>
                <div>
                    { isInbox &&
                        <ButtonGrey
                            className={styles.button}
                            onClick={() => utils.moveToHistory(message)}
                            title='Move to History'
                        />
                    }
                    { !isInbox &&
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

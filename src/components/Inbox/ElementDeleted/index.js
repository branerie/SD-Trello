import React, { useState } from 'react'
import commonStyles from '../index.module.css'
import ButtonGrey from '../../ButtonGrey'
import ConfirmDialog from '../../ConfirmationDialog'
import useInboxUtils from '../useInboxUtils'

const ElementDeleted = ({ message, setInboxHistory, options, isInbox, deletedElement }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { deleteMessage, moveToHistory } = useInboxUtils()

    return (
        <>
            { isConfirmOpen &&
                <ConfirmDialog
                    title='delete this message'
                    hideConfirm={() => setIsConfirmOpen(false)}
                    onConfirm={() => deleteMessage(message, setInboxHistory)}
                />
            }
            <div className={commonStyles.message}>
                <div className={commonStyles.container}>
                    <div className={commonStyles.container}>
                        { deletedElement === 'Team'
                            ? <div className={commonStyles.bold}>{deletedElement} {message.team.name} deleted</div>
                            : <div className={commonStyles.bold}>{deletedElement} {message.project.name} deleted</div>
                        }
                    </div>
                    <div>{new Date(message.createdAt).toLocaleDateString('en-US', options)}</div>
                </div>
                <div>
                    <div className={`${commonStyles.bold} ${commonStyles.inline}`}>Deleted by:</div>
                    <div className={commonStyles.inline}>{message.sendFrom.username}</div>
                </div>
                <div>
                    { isInbox
                        ? <ButtonGrey
                            className={commonStyles.button}
                            onClick={() => moveToHistory(message)}
                            title='Move to History'
                        />
                        : <ButtonGrey
                            className={commonStyles.button}
                            onClick={() => setIsConfirmOpen(true)}
                            title='Delete Message'
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default ElementDeleted
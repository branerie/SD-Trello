import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import commonStyles from '../index.module.css'
import ButtonGrey from '../../ButtonGrey'
import ConfirmDialog from '../../ConfirmationDialog'
import useInboxUtils from '../useInboxUtils'

const TaskAssignment = ({ message, setInboxHistory, options, isInbox }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { deleteMessage, moveToHistory }= useInboxUtils()
    const history = useHistory()

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
                    <div className={commonStyles.bold}>{message.subject}</div>
                    <div>{new Date(message.createdAt).toLocaleDateString('en-US', options)}</div>
                </div>
                <div>
                    <div className={`${commonStyles.inline} ${commonStyles.margin}`}>
                        <span className={commonStyles.bold}>Project:</span>
                            {message.project.name}
                    </div>
                    <div className={`${commonStyles.inline} ${commonStyles.margin}`}>
                        <span className={commonStyles.bold}>List:</span>
                            {message.list.name}
                    </div>
                    <div className={`${commonStyles.inline} ${commonStyles.margin}`}>
                        <span className={commonStyles.bold}>Task:</span>
                            {message.card.name}
                    </div>
                </div>
                <div>
                    <div className={`${commonStyles.bold} ${commonStyles.inline}`}>Assigned by:</div>
                    <div className={commonStyles.inline}>{message.sendFrom.username}</div>
                </div>
                { (message.team.isDeleted || message.project.isDeleted) &&
                    <div className={commonStyles.bold}>Project deleted</div>
                }
                <div>
                    { !message.team.isDeleted && !message.project.isDeleted &&
                        <ButtonGrey
                            className={commonStyles.button}
                            onClick={() => history.push(`/project-board/${message.team.id}/${message.project.id}`)}
                            title='Go to Project'
                        />
                    }
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

export default TaskAssignment
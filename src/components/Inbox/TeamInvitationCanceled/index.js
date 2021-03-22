import React, { useState } from 'react'
import commonStyles from '../index.module.css'
import ButtonGrey from '../../ButtonGrey'
import ConfirmDialog from '../../ConfirmationDialog'
import EditTeam from '../../EditTeam'
import Transparent from '../../Transparent'
import useInboxUtils from '../useInboxUtils'

const TeamInvitationCanceled = ({ message, setInboxHistory, options, isInbox }) => {
    const [isShownTeamForm, setIsShownTeamForm] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { deleteMessage, viewTeam, moveToHistory } = useInboxUtils()

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
                    <div className={`${commonStyles.bold} ${commonStyles.inline}`}>Team name:</div>
                    <div className={commonStyles.inline}>{message.team.name}</div>
                </div>
                <div>
                    <div className={`${commonStyles.bold} ${commonStyles.inline}`}>Invited by:</div>
                    <div className={commonStyles.inline}>{message.sendFrom.username}</div>
                </div>
                {/* REVIEW: Следващите две може да станат на тернари, вместо да се прави двойна проверка */}
                { message.team.isDeleted &&
                    <div className={commonStyles.bold}>Team deleted</div>
                }
                { !message.team.isDeleted &&
                    <ButtonGrey
                        className={commonStyles.button}
                        onClick={() => viewTeam(message, setCurrTeam, setIsShownTeamForm)}
                        title='View Team'
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
                { isShownTeamForm &&
                    <Transparent hideForm={() => setIsShownTeamForm(false)}>
                        <EditTeam currTeam={currTeam} isMessage={true} hideForm={() => setIsShownTeamForm(false)} />
                    </Transparent>
                }
            </div>
        </>
    )
}

export default TeamInvitationCanceled
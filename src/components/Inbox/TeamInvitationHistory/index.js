import React, { useState } from 'react'
import commonStyles from '../index.module.css'
import ButtonGrey from '../../ButtonGrey'
import ConfirmDialog from '../../ConfirmationDialog'
import EditTeam from '../../EditTeam'
import Transparent from '../../Transparent'
import useInboxUtils from '../useInboxUtils'

const TeamInvitationHistory = ({ message, options, setInboxHistory }) => {
    const [isShownTeamForm, setIsShownTeamForm] = useState(false)
    const [isConfirmOpen, setIsComfirmOpen] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
    const { deleteMessage, viewTeam } = useInboxUtils()

    return (
        <>
            { isConfirmOpen &&
                <ConfirmDialog
                    title='delete this message'
                    hideConfirm={() => setIsComfirmOpen(false)}
                    onConfirm={() => deleteMessage(message, setInboxHistory)}
                />
            }
            <div className={commonStyles.message}>
                <div className={commonStyles.container}>
                    {message.accepted === undefined 
                        ? <div className={commonStyles.container}>
                            <div className={commonStyles.bold}>{message.subject}</div>
                        </div>
                        : <div className={commonStyles.container}>
                            <div className={commonStyles.bold}>{message.subject}:</div>
                            {message.accepted ? <div>Accepted</div> : <div>Declined</div>}
                        </div>
                    }
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
                { message.team.isDeleted &&
                    <div className={`${commonStyles.bold} ${commonStyles.inline}`}>Team deleted</div>
                }
                <div>
                    { !message.team.isDeleted &&
                        <ButtonGrey
                            className={commonStyles.button}
                            onClick={() => viewTeam(message, setCurrTeam, setIsShownTeamForm)}
                            title='View Team'
                        />
                    }
                    <ButtonGrey
                        className={commonStyles.button}
                        onClick={() => setIsComfirmOpen(true)}
                        title='Delete Message'
                    />
                    { isShownTeamForm &&
                        <Transparent hideForm={() => setIsShownTeamForm(false)}>
                            <EditTeam currTeam={currTeam} isMessage={true} hideForm={() => setIsShownTeamForm(false) } />
                        </Transparent>
                    }
                </div>
            </div>
        </>
    )
}

export default TeamInvitationHistory
import React, { useState } from 'react'
import commonStyles from '../index.module.css'
import ButtonGrey from '../../ButtonGrey'
import EditTeam from '../../EditTeam'
import Transparent from '../../Transparent'
import useInboxUtils from '../useInboxUtils'

const TeamInvitationInbox = ({ message, setInbox, setInboxHistory, options }) => {
    const [isShownTeamForm, setIsShownTeamForm] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
    const { responseInvitation, viewTeam, moveToHistory } = useInboxUtils()

    return (
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
            {
                message.team.isDeleted
                    ? <div>
                        <div className={commonStyles.bold}>Team deleted</div>
                        <ButtonGrey
                            className={commonStyles.button}
                            onClick={() => moveToHistory(message)}
                            title='Move to History'
                        />
                    </div>
                    : <div>
                        <ButtonGrey
                            className={commonStyles.button}
                            onClick={() => responseInvitation(message, true, setInbox, setInboxHistory)}
                            title='Accept'
                        />
                        <ButtonGrey
                            className={commonStyles.button}
                            onClick={() => responseInvitation(message, false, setInbox, setInboxHistory)}
                            title='Decline'
                        />
                        <ButtonGrey
                            className={commonStyles.button}
                            onClick={() => viewTeam(message, setCurrTeam, setIsShownTeamForm)}
                            title='View Team'
                        />
                    </div>
            }
            {
                isShownTeamForm &&
                <Transparent hideForm={() => setIsShownTeamForm(false)}>
                    <EditTeam currTeam={currTeam} isMessage={true} hideForm={() => { setIsShownTeamForm(false) }} />
                </Transparent>
            }
        </div>
    )
}

export default TeamInvitationInbox
import React, { useContext, useState } from 'react'
import TeamContext from '../../../contexts/TeamContext'
import commonStyles from '../index.module.css'
import LinkComponentTitle from '../../LinkTitle'
import ButtonClean from '../../ButtonClean'
import Transparent from '../../Transparent'
import CreateTeam from '../../CreateTeam'
import ButtonCleanTitle from '../../ButtonCleanTitle'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'

const TeamDropdown = () => {
    const { selectedTeam, teams, getCurrentProjects, setSelectedTeam } = useContext(TeamContext)
    const [isShownTeamForm, setIsShownTeamForm] = useState(false)
    const [isTeamActive, setIsTeamActive, teamRef] = useDetectOutsideClick()

    const selectTeam = (teamId, teamName) => {
        getCurrentProjects(teamId)
        setSelectedTeam(teamName)
        setIsTeamActive(false)
    }

    return (
        <div className={`${commonStyles.container} ${commonStyles['team-media']}`}>
            <div className={commonStyles.title}>Team:</div>
            <div className={commonStyles['dropdown-container']}>
                <ButtonCleanTitle
                    className={commonStyles.button}
                    onClick={() => setIsTeamActive(!isTeamActive)}
                    title={selectedTeam}
                />
                {isTeamActive && <div className={commonStyles.dropdown} ref={teamRef}>
                    <div className={commonStyles['options-container']}>
                        {teams.map(t => (
                            <LinkComponentTitle
                                href={`/team/${t._id}`}
                                key={t._id}
                                title={t.name}
                                onClick={() => selectTeam(t._id, t.name)}
                                className={commonStyles.options}
                            />
                        ))}
                    </div>
                    <ButtonClean
                        onClick={() => setIsShownTeamForm(true)}
                        title='Create Team'
                        className={`${commonStyles.options} ${commonStyles['last-option']}`}
                    />
                </div>}
            </div>
            {isShownTeamForm &&  <Transparent hideForm={() => setIsShownTeamForm(false)}>
                                    <CreateTeam hideForm={() => { setIsShownTeamForm(false) }} />
                                </Transparent>}
        </div>
    )
}

export default TeamDropdown
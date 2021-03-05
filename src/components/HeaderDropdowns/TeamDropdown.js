import React, { useContext, useRef, useState } from 'react'
import styles from "./index.module.css"
import LinkComponentTitle from '../LinkTitle'
import ButtonClean from '../ButtonClean'
import Transparent from '../Transparent'
import CreateTeam from '../CreateTeam'
import TeamContext from '../../contexts/TeamContext'
import ButtonCleanTitle from '../ButtonCleanTitle'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

export default function TeamDropdown() {
    const teamContext = useContext(TeamContext)
    const teamRef = useRef(null)
    const [showTeamForm, setShowTeamForm] = useState(false)
    const [isTeamActive, setIsTeamActive] = useDetectOutsideClick(teamRef)

    function selectTeam(teamId, teamName) {
        teamContext.getCurrentProjects(teamId)
        teamContext.setSelectedTeam(teamName)
        setIsTeamActive(false)
    }

    return (
        <div className={`${styles.container} ${styles['team-media']}`}>
            <div className={styles.title}>Team:</div>
            <div className={styles['dropdown-container']}>
                <ButtonCleanTitle
                    className={styles.button}
                    onClick={() => setIsTeamActive(!isTeamActive)}
                    title={teamContext.selectedTeam}
                />
                {isTeamActive && <div className={styles.dropdown} ref={teamRef}>
                    <div className={styles['options-container']}>
                        {teamContext.teams.map(t => (
                            <LinkComponentTitle
                                href={`/team/${t._id}`}
                                key={t._id}
                                title={t.name}
                                onClick={() => { selectTeam(t._id, t.name) }}
                                className={styles.options}
                            />
                        ))}
                    </div>
                    <ButtonClean
                        onClick={() => setShowTeamForm(true)}
                        title='Create Team'
                        className={`${styles.options} ${styles['last-option']}`}
                    />
                </div>}
            </div>
            {showTeamForm && (<Transparent hideForm={() => setShowTeamForm(false)}>
                <CreateTeam hideForm={() => { setShowTeamForm(false) }} ></CreateTeam>
            </Transparent>)}
        </div>
    )
}




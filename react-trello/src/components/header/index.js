import React, { useContext, useRef, useState } from "react"
import styles from "./index.module.css"
import UserContext from "../../contexts/UserContext"
import Avatar from "react-avatar"
import { useDetectOutsideClick } from "../../utils/useDetectOutsideClick"
import LinkComponent from "../link"
import ButtonClean from "../button-clean"
import TeamContext from "../../contexts/TeamContext"
import Transparent from "../transparent"
import CreateTeam from "../create-team"
import ProjectContext from "../../contexts/ProjectContext"

const Header = ({ asideOn }) => {
    const dropdownRef = useRef(null)
    const [isProfileActive, setIsProfileActive] = useDetectOutsideClick(dropdownRef, false)
    const [isViewActive, setIsViewActive] = useDetectOutsideClick(dropdownRef, false)
    const [isTeamActive, setIsTeamActive] = useDetectOutsideClick(dropdownRef, false)
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('Select')
    const context = useContext(UserContext)
    const projectContext = useContext(ProjectContext)
    const teamContext = useContext(TeamContext)

    function selectTeam(teamId) {
        teamContext.setOption(teamId)
        teamContext.getCurrentProjects(teamId)
    }

    return (
        <header className={`${styles.navigation} ${asideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>
                    <div className={styles.margin}>
                        Change
                    </div>
                    <div>
                        <ButtonClean
                            className={styles.view}
                            onClick={() => setIsViewActive(!isViewActive)}
                            title='View'
                        />
                        {
                            isViewActive ? <div
                                ref={dropdownRef}
                                className={`${styles.options} ${styles.font} ${styles['view-position']}`}
                            >
                                <div className={styles['first-option']}>
                                    <LinkComponent
                                        href={`/projects/${projectContext.project}`}
                                        title='Board'
                                        className={styles.hover}
                                    />
                                </div>
                                <div className={styles['last-option']}>
                                    <LinkComponent
                                        href={`/calendar-view/${projectContext.project}`}
                                        title='List'
                                        className={styles.hover}
                                    />
                                </div>
                            </div> : null
                        }
                    </div>
                    <div className={styles.margin}>
                        Teams:
                    </div>
                    <div>
                        <ButtonClean
                            className={styles.teams}
                            onClick={() => setIsTeamActive(!isTeamActive)}
                            title={title}
                        />
                        {
                            isTeamActive ? <div
                                ref={dropdownRef}
                                className={`${styles.options} ${styles.font} ${styles['teams-position']}`}
                            >
                                <div className={styles['first-option']}>
                                    <LinkComponent
                                        title='Select'
                                        onClick={() => setTitle('Select')}
                                        className={`${styles.overflow} ${styles.hover}`}
                                    />
                                </div>
                                {
                                    teamContext.teams.map(t => (
                                        <div className={styles['team-options']}>
                                            <LinkComponent
                                                key={t._id}
                                                href={`/team/${t._id}`}
                                                title={t.name} onClick={() => { selectTeam(t._id) }}
                                                onClick={() => setTitle(t.name)}
                                                className={`${styles.overflow} ${styles.hover}`}
                                            />
                                        </div>
                                    ))
                                }
                                <div className={styles['last-option']}>
                                    <ButtonClean
                                        onClick={() => setShowForm(true)}
                                        title='Create New Team'
                                        className={styles.logout}
                                    />
                                </div>
                            </div> : null
                        }
                    </div>
                </div>
                {
                    showForm ? (<Transparent hideForm={() => setShowForm(false)}>
                        <CreateTeam setOption={teamContext.setOption} hideForm={() => { setShowForm(false) }} ></CreateTeam>
                    </Transparent>) : null
                }
                <div className={`${styles.links} ${styles.font}`}>
                    <input className={styles.input} type='text' placeholder='Search...' />
                    <ButtonClean
                        className={styles.avatar}
                        onClick={() => setIsProfileActive(!isProfileActive)}
                        title={<Avatar name={context.user.username} size={40} round={true} maxInitials={2} />}
                    />
                    {
                        isProfileActive ? <div
                            ref={dropdownRef}
                            className={`${styles.options} ${styles['logout-position']}`}
                        >
                            <div className={styles['first-option']}>
                                <LinkComponent
                                    href={`/profile/${context.user && context.user.id}`}
                                    title='Profile'
                                    className={styles.hover}
                                />
                            </div>
                            <div className={styles['last-option']}>
                                <ButtonClean
                                    onClick={context.logOut}
                                    title='Log Out'
                                    className={styles.logout}
                                />
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        </header>
    )
}

export default Header
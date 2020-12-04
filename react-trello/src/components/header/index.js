import React, { useContext, useRef, useState, useEffect } from "react"
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
import { useParams } from "react-router-dom"

const Header = ({ asideOn }) => {
    const dropdownRefProfile = useRef(null)
    const dropdownRefView = useRef(null)
    const dropdownRefTeam = useRef(null)
    const [isTeamActive, setIsTeamActive] = useDetectOutsideClick(dropdownRefTeam)
    const [isViewVisibble, setIsViewVisibble] = useState(false)
    const [isViewActive, setIsViewActive] = useDetectOutsideClick(dropdownRefView)
    const [viewState, setViewState] = useState(null)
    const [isProfileActive, setIsProfileActive] = useDetectOutsideClick(dropdownRefProfile)
    const [showForm, setShowForm] = useState(false)
    const context = useContext(UserContext)
    const projectContext = useContext(ProjectContext)
    const teamContext = useContext(TeamContext)
    const params = useParams()

    function selectTeam(teamId, teamName) {
        teamContext.getCurrentProjects(teamId)
        teamContext.setSelectedTeam(teamName)
        setIsTeamActive(false)
    }

    useEffect(() => {
        if (!(window.location.href.includes('team') || window.location.href.includes('project'))) {
            teamContext.setSelectedTeam('Select')
        } else if (teamContext.selectedTeam === 'Select') {
            const teamId = params.teamid
            teamContext.updateSelectedTeam(teamId)
        }

        if (window.location.href.includes('project')) {
            setIsViewVisibble(true)

            if (window.location.href.includes('board')) {
                setViewState('Board')
            }
            if (window.location.href.includes('list')) {
                setViewState('List')
            }
        }
    })

    return (
        <header className={`${styles.navigation} ${asideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>

                    <div className={styles.margin}>
                        Teams:
                    </div>
                    <div>
                        <ButtonClean
                            className={styles.teams}
                            onClick={() => setIsTeamActive(!isTeamActive)}
                            title={teamContext.selectedTeam}
                        />
                        {
                            isTeamActive ? <div
                                ref={dropdownRefTeam}
                                className={`${styles.options} ${styles.font} ${styles['teams-position']}`}
                            >
                                {
                                    teamContext.teams.map(t => (
                                        <div key={t._id} className={styles['team-options']}>
                                            <LinkComponent
                                                href={`/team/${t._id}`}
                                                title={t.name}
                                                onClick={() => { selectTeam(t._id, t.name) }}
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
                    {
                        showForm ? (<Transparent hideForm={() => setShowForm(false)}>
                            <CreateTeam hideForm={() => { setShowForm(false) }} ></CreateTeam>
                        </Transparent>) : null
                    }
                    {isViewVisibble && <div className={styles.flex}>
                        <div className={styles.margin}>
                            View:
                        </div>
                        <div>
                            <ButtonClean
                                className={styles.view}
                                onClick={() => setIsViewActive(!isViewActive)}
                                title={viewState}
                            />
                            {
                                isViewActive ? <div
                                    ref={dropdownRefView}
                                    className={`${styles.options} ${styles.font} ${styles['view-position']}`}
                                >
                                    <div className={styles['first-option']}>
                                        <LinkComponent
                                            href={`/project-board/${params.teamid}/${projectContext.project}`}
                                            title='Board'
                                            className={styles.hover}
                                        />
                                    </div>
                                    <div className={styles['last-option']}>
                                        <LinkComponent
                                            href={`/project-list/${params.teamid}/${projectContext.project}`}
                                            title='List'
                                            className={styles.hover}
                                        />
                                    </div>
                                </div> : null
                            }
                        </div>
                    </div>}
                </div>

                <div className={`${styles.links} ${styles.font}`}>
                    <input className={styles.input} type='text' placeholder='Search...' />
                    <ButtonClean
                        className={styles.avatar}
                        onClick={() => setIsProfileActive(!isProfileActive)}
                        title={<Avatar name={context.user.username} size={40} round={true} maxInitials={2} />}
                    />
                    {
                        isProfileActive ? <div
                            ref={dropdownRefProfile}
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
import React, { useContext, useRef, useState, useEffect, useCallback } from "react"
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
import { useHistory, useParams } from "react-router-dom"
import CreateProject from "../create-project"
import getCookie from "../../utils/cookie"

const Header = ({ asideOn }) => {
    const dropdownRefProfile = useRef(null)
    const dropdownRefView = useRef(null)
    const dropdownRefProject = useRef(null)
    const dropdownRefTeam = useRef(null)
    const [isProjectVisibble, setIsProjectVisibble] = useState(false)
    const [isProjectActive, setIsProjectActive] = useDetectOutsideClick(dropdownRefProject)
    const [isTeamActive, setIsTeamActive] = useDetectOutsideClick(dropdownRefTeam)
    const [isViewVisibble, setIsViewVisibble] = useState(false)
    const [isViewActive, setIsViewActive] = useDetectOutsideClick(dropdownRefView)
    const [viewState, setViewState] = useState(null)
    const [isProfileActive, setIsProfileActive] = useDetectOutsideClick(dropdownRefProfile)
    const [showTeamForm, setShowTeamForm] = useState(false)
    const [showProjectForm, setShowProjectForm] = useState(false)
    const context = useContext(UserContext)
    const projectContext = useContext(ProjectContext)
    const teamContext = useContext(TeamContext)
    const params = useParams()
    const history = useHistory()

    function selectTeam(teamId, teamName) {
        teamContext.getCurrentProjects(teamId)
        teamContext.setSelectedTeam(teamName)
        setIsTeamActive(false)
    }

    const getData = useCallback(async () => {
        const id = params.projectid
        const token = getCookie("x-auth-token");

        const response = await fetch(`/api/projects/info/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const data = await response.json()
            projectContext.setProject(data)
        }
    }, [history, params, projectContext])

    useEffect(() => {
        if (!(window.location.href.includes('team') || window.location.href.includes('project'))) {
            teamContext.setSelectedTeam('Select')
        } else if (teamContext.selectedTeam === 'Select') {
            const teamId = params.teamid
            teamContext.updateSelectedTeam(teamId)
        }

        if (window.location.href.includes('project')) {
            setIsViewVisibble(true)
            setIsProjectVisibble(true)
            teamContext.getCurrentProjects(params.teamid)

            if (projectContext.project === null || projectContext.project._id !== params.projectid) {
                getData()
            }

            if (window.location.href.includes('board')) {
                setViewState('Board')
            }
            if (window.location.href.includes('list')) {
                setViewState('List')
            }
        }
    }, [getData, params, params.teamid, projectContext.project, teamContext])

    if (window.location.href.includes('project') && !projectContext.project) {
        return null
    }

    return (
        <header className={`${styles.navigation} ${asideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>

                    <div className={styles.margin}>
                        Team:
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
                                        onClick={() => setShowTeamForm(true)}
                                        title='Create Team'
                                        className={styles.logout}
                                    />
                                </div>
                            </div> : null
                        }
                    </div>
                    {
                        showTeamForm ? (<Transparent hideForm={() => setShowTeamForm(false)}>
                            <CreateTeam hideForm={() => { setShowTeamForm(false) }} ></CreateTeam>
                        </Transparent>) : null
                    }


                    {isProjectVisibble && <div className={styles.flex}>
                        <div className={styles.margin}>
                            Project:
                        </div>
                        <div>
                            <ButtonClean
                                className={styles.teams}
                                onClick={() => setIsProjectActive(!isProjectActive)}
                                title={projectContext.project.name}
                            />
                            {
                                isProjectActive ? <div
                                    ref={dropdownRefProject}
                                    className={`${styles.options} ${styles.font} ${styles['projects-position']}`}
                                >
                                    {
                                        teamContext.currentProjects.map(p => (
                                            <div key={p._id} className={styles['team-options']}>
                                                <LinkComponent
                                                    href={`/project-board/${params.teamid}/${p._id}`}
                                                    title={p.name}
                                                    onClick={() => { setIsProjectActive(false) }}
                                                    className={`${styles.overflow} ${styles.hover}`}
                                                />
                                            </div>
                                        ))
                                    }
                                    <div className={styles['last-option']}>
                                        <ButtonClean
                                            onClick={() => setShowProjectForm(true)}
                                            title='Create Project'
                                            className={styles.logout}
                                        />
                                    </div>
                                </div> : null
                            }
                        </div>
                        {
                            showProjectForm && <Transparent hideForm={() => setShowProjectForm(false)}>
                                <CreateProject hideForm={() => setShowProjectForm(false)} />
                            </Transparent>
                        }
                    </div>}



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
                                            href={`/project-board/${params.teamid}/${projectContext.project._id}`}
                                            title='Board'
                                            className={styles.hover}
                                            onClick={() => { setIsViewActive(false) }}
                                        />
                                    </div>
                                    <div className={styles['last-option']}>
                                        <LinkComponent
                                            href={`/project-list/${params.teamid}/${projectContext.project._id}`}
                                            title='List'
                                            className={styles.hover}
                                            onClick={() => { setIsViewActive(false) }}
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
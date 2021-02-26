import React, { useContext, useRef, useState, useEffect, useCallback } from "react"
import styles from "./index.module.css"
import UserContext from "../../contexts/UserContext"
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
// import SearchResults from "../search-results"
import { useSocket } from "../../contexts/SocketProvider"
import AvatarUser from "../avatar-user"
import SearchField from "../searchField"

const Header = ({ asideOn }) => {
    const dropdownRefProfile = useRef(null)
    const dropdownRefView = useRef(null)
    const dropdownRefProject = useRef(null)
    const dropdownRefTeam = useRef(null)
    // const dropdownRefSearch = useRef(null)
    const [isProjectVisibble, setIsProjectVisibble] = useState(false)
    const [isProjectActive, setIsProjectActive] = useDetectOutsideClick(dropdownRefProject)
    const [isTeamActive, setIsTeamActive] = useDetectOutsideClick(dropdownRefTeam)
    const [isViewVisibble, setIsViewVisibble] = useState(false)
    const [isViewActive, setIsViewActive] = useDetectOutsideClick(dropdownRefView)
    const [viewState, setViewState] = useState(null)
    const [isProfileActive, setIsProfileActive] = useDetectOutsideClick(dropdownRefProfile)
    const [showTeamForm, setShowTeamForm] = useState(false)
    // const [showSearchForm, setShowSearchForm] = useDetectOutsideClick(dropdownRefSearch)
    // const [searchInput, setSearchInput] = useState('')
    const [showProjectForm, setShowProjectForm] = useState(false)
    // const [showSearchInput, setShowSearchInput] = useState(false)
    const context = useContext(UserContext)
    const projectContext = useContext(ProjectContext)
    const teamContext = useContext(TeamContext)
    const params = useParams()
    const history = useHistory()
    const socket = useSocket()
    const [showOldProjects, setShowOldProjects] = useState(false)


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
            } else if (projectContext.project.isFinished === true) {
                setShowOldProjects(true)
            } else if(projectContext.project.isFinished === false){
                setShowOldProjects(false)
            }

            if (window.location.href.includes('board')) {
                setViewState('Board')
            }
            if (window.location.href.includes('list')) {
                setViewState('List')
            }
        }
    }, [getData, params, params.teamid, projectContext.project, teamContext,])

    useEffect(() => {
        if (!(window.location.href.includes('team') || window.location.href.includes('project'))) return
        if (socket == null) return
        socket.on('team-deleted', goToHomePage)
        return () => socket.off('team-deleted')
    })

    useEffect(() => {
        if (!window.location.href.includes('project')) return
        if (socket == null) return
        socket.on('project-deleted', goToTeamPage)
        return () => socket.off('project-deleted')
    })

    function goToHomePage(deletedTeamId) {
        if (deletedTeamId !== params.teamid) return
        history.push('/')
    }

    function goToTeamPage(deletedProjectId) {
        if (deletedProjectId !== params.projectid) return
        history.push(`/team/${params.teamid}`)
    }

    if (window.location.href.includes('project') && !projectContext.project) {
        return null
    }

    // const onBlur = () => {
    //     setTimeout(() => (setShowSearchForm(false)), 120)
    // }

    // const getFullImageUrl = (imagePath) => {
    //     return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/w_400,h_400,c_crop,g_face,r_max/w_200/${imagePath}`
    // }

    return (
        <header className={`${styles.navigation} ${asideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>
                    <div className={`${styles['team-container']} ${styles.flex}`}>
                        <div className={styles.margin}>
                            Team:
                        </div>
                        <div className={styles['list-container']}>
                            <ButtonClean
                                className={styles.teams}
                                onClick={() => setIsTeamActive(!isTeamActive)}
                                title={teamContext.selectedTeam}
                            />
                            {
                                isTeamActive ? <div
                                    ref={dropdownRefTeam}
                                    className={styles.options}
                                >
                                    {
                                        teamContext.teams.map(t => (
                                            <div key={t._id} className={`${styles['team-options']} ${styles.hover}`}>
                                                <LinkComponent
                                                    href={`/team/${t._id}`}
                                                    title={t.name}
                                                    onClick={() => { selectTeam(t._id, t.name) }}
                                                    className={`${styles.overflow} ${styles.hover}`}
                                                />
                                            </div>
                                        ))
                                    }
                                    <div className={`${styles['last-option']} ${styles.hover}`}>
                                        <ButtonClean
                                            onClick={() => setShowTeamForm(true)}
                                            title='Create Team'
                                            className={`${styles.logout} ${styles.hover}`}
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
                    </div>



                    {isProjectVisibble &&
                        <div className={`${styles['project-container']} ${styles.flex}`}>
                            <div className={styles.margin}>
                                Project:
                            </div>
                            <div className={styles['list-container']}>
                                <ButtonClean
                                    className={styles.teams}
                                    onClick={() => setIsProjectActive(!isProjectActive)}
                                    title={projectContext.project.name}
                                />
                                {
                                    isProjectActive ? <div
                                        ref={dropdownRefProject}
                                        className={styles.options}
                                    >
                                        {
                                            teamContext.currentProjects.filter(!showOldProjects ? (p => (p.isFinished === false) || (p.isFinished === undefined)) : (p => (p.isFinished === true)))
                                                .reverse()
                                                .map(p => (
                                                    <div key={p._id} className={`${styles['team-options']} ${styles.hover}`}>
                                                        <LinkComponent
                                                            href={`/project-board/${params.teamid}/${p._id}`}
                                                            title={p.name}
                                                            onClick={() => { setIsProjectActive(false) }}
                                                            className={`${styles.overflow} ${styles.hover}`}
                                                        />
                                                    </div>
                                                ))
                                        }
                                        <div className={`${styles['last-option']} ${styles.hover}`}>
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
                        <div className={styles['list-container']}>
                            <ButtonClean
                                className={styles.teams}
                                onClick={() => setIsViewActive(!isViewActive)}
                                title={viewState}
                            />
                            {
                                isViewActive ? <div
                                    ref={dropdownRefView}
                                    className={styles.options}
                                >
                                    <div className={`${styles['first-option']} ${styles.hover}`}>
                                        <ButtonClean
                                            className={`${styles['profile-button']} ${styles.hover}`}
                                            onClick={() => { history.push(`/project-board/${params.teamid}/${projectContext.project._id}`); setIsViewActive(false) }}
                                            title='Board'

                                        />
                                    </div>
                                    <div className={`${styles['last-option']} ${styles.hover}`}>
                                        <ButtonClean
                                            // href={`/project-list/${params.teamid}/${projectContext.project._id}`}
                                            title='List'
                                            className={`${styles['list-button']} ${styles.hover}`}
                                            onClick={() => { history.push(`/project-list/${params.teamid}/${projectContext.project._id}`); setIsViewActive(false) }}
                                        />
                                    </div>
                                </div> : null
                            }
                        </div>
                    </div>}
                </div>

                <div className={`${styles.links} ${styles.font}`}>
                    <SearchField />
                    {/* <span>
                        <input className={styles.input} type='text'
                            placeholder={!showSearchForm ? 'Search...' : 'Enter Project or Team name'}
                            autoComplete="off"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onClick={() => setShowSearchForm(true)}
                            onBlur={onBlur}
                        />
                        {
                            (
                                searchInput.length > 0
                                &&
                                showSearchForm) ?
                                <div ref={dropdownRefSearch}>
                                    <SearchResults searchInput={searchInput} hideForm={() => { setShowSearchForm(!showSearchForm); setSearchInput('') }} />
                                </div>
                                : null
                        }
                    </span>
                    <div className={styles['search-button']} >
                            <ButtonClean
                                onClick={() => setShowSearchInput(!showSearchInput)}
                                title={<img className={styles['search-icon']} src={searchImg} alt="search" />} />
                    </div> */}
                    <ButtonClean
                        className={styles.avatar}
                        onClick={() => setIsProfileActive(!isProfileActive)}
                        title={
                            <AvatarUser user={context.user} size={40} />
                        }
                    />
                    {
                        isProfileActive ? <div
                            ref={dropdownRefProfile}
                            className={`${styles.options} ${styles['logout-position']}`}
                        >
                            <div className={`${styles['first-option']} ${styles.hover}`}>
                                <ButtonClean
                                    title='Profile'
                                    className={`${styles['profile-button']} ${styles.hover}`}
                                    onClick={() => history.push(`/profile/${context.user && context.user.id}`)}
                                />
                            </div>
                            <div className={`${styles['last-option']} ${styles.hover}`}>
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
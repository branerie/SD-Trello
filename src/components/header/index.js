import React, { useContext, useRef, useState, useEffect, useCallback } from "react"
import styles from "./index.module.css"
import UserContext from "../../contexts/UserContext"
import { useDetectOutsideClick } from "../../utils/useDetectOutsideClick"
import ButtonClean from "../button-clean"
import TeamContext from "../../contexts/TeamContext"
import ProjectContext from "../../contexts/ProjectContext"
import { useHistory, useParams } from "react-router-dom"
import getCookie from "../../utils/cookie"
import { useSocket } from "../../contexts/SocketProvider"
import AvatarUser from "../avatar-user"
import SearchField from "../searchField"
import TeamDropdown from "../header-dropdowns/team-dropdown"
import ProjectDropdown from "../header-dropdowns/project-dropdown"
import ViewDropdown from "../header-dropdowns/view-dropdown"

const Header = ({ asideOn }) => {
    const dropdownRefProfile = useRef(null)
    const [isProjectVisibble, setIsProjectVisibble] = useState(false)
    const [isViewVisibble, setIsViewVisibble] = useState(false)
    const [isProfileActive, setIsProfileActive] = useDetectOutsideClick(dropdownRefProfile)
    const context = useContext(UserContext)
    const projectContext = useContext(ProjectContext)
    const teamContext = useContext(TeamContext)
    const params = useParams()
    const history = useHistory()
    const socket = useSocket()

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

    async function goToHomePage(deletedTeamId) {
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

    return (
        <header className={`${styles.navigation} ${asideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>
                    <TeamDropdown/>
                    {isProjectVisibble && <ProjectDropdown/>}
                    {isViewVisibble && <ViewDropdown/>}
                </div>

                <div className={`${styles.links} ${styles.font}`}>
                    <SearchField asideOn={asideOn} />

                    <ButtonClean
                        className={styles.avatar}
                        onClick={() => setIsProfileActive(!isProfileActive)}
                        title={
                            <AvatarUser user={context.user} size={40} />
                        }
                    />
                    {isProfileActive &&
                        <div
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
                        </div>
                    }
                </div>
            </div>
        </header>
    )
}

export default Header
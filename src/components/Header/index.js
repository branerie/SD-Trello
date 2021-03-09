import React, { useContext, useState, useEffect, useCallback } from 'react'
import styles from './index.module.css'
import TeamContext from '../../contexts/TeamContext'
import ProjectContext from '../../contexts/ProjectContext'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import SearchField from '../SearchField'
import TeamDropdown from '../HeaderDropdowns/TeamDropdown'
import ProjectDropdown from '../HeaderDropdowns/ProjectDropdown'
import ViewDropdown from '../HeaderDropdowns/ViewDropdown'
import ProfileDropdown from '../HeaderDropdowns/ProfileDropdown'
import useProjectsServices from '../../services/useProjectsServices'

const Header = ({ asideOn }) => {
    const [isProjectVisibble, setIsProjectVisibble] = useState(false)
    const [isViewVisibble, setIsViewVisibble] = useState(false)
    const projectContext = useContext(ProjectContext)
    const teamContext = useContext(TeamContext)
    const params = useParams()
    const history = useHistory()
    const socket = useSocket()
    const { getProjectInfo } = useProjectsServices()

    const getData = useCallback(async () => {
        const data = await getProjectInfo(params.projectid)
        projectContext.setProject(data)
    }, [getProjectInfo, params, projectContext])

    const goToHomePage = useCallback((deletedTeamId) => {
        if (deletedTeamId !== params.teamid) return
        history.push('/')
    }, [history, params.teamid])

    const goToTeamPage = useCallback((deletedProjectId) => {
        if (deletedProjectId !== params.projectid) return
        history.push(`/team/${params.teamid}`)
    }, [history, params.projectid, params.teamid])

    useEffect(() => {
        if (!(window.location.href.includes('team') || window.location.href.includes('project'))) {
            teamContext.setSelectedTeam('Select')
            return
        }

        if (teamContext.selectedTeam === 'Select') {
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
    }, [goToHomePage, socket])

    useEffect(() => {
        if (!window.location.href.includes('project')) return

        if (socket == null) return

        socket.on('project-deleted', goToTeamPage)
        return () => socket.off('project-deleted')
    }, [goToTeamPage, socket])

    if (window.location.href.includes('project') && !projectContext.project) {
        return null
    }

    return (
        <header className={`${styles.navigation} ${asideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>
                    <TeamDropdown />
                    {isProjectVisibble && <ProjectDropdown />}
                    {isViewVisibble && <ViewDropdown />}
                </div>

                <div className={`${styles.links} ${styles.font}`}>
                    <SearchField asideOn={asideOn} />
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    )
}

export default Header
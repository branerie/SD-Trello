import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import ProjectContext from '../../contexts/ProjectContext'
import TeamContext from '../../contexts/TeamContext'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import SearchField from '../SearchField'
import TeamDropdown from '../HeaderDropdowns/TeamDropdown'
import ProjectDropdown from '../HeaderDropdowns/ProjectDropdown'
import ViewDropdown from '../HeaderDropdowns/ViewDropdown'
import ProfileDropdown from '../HeaderDropdowns/ProfileDropdown'
import useProjectsServices from '../../services/useProjectsServices'

const Header = ({ isAsideOn }) => {
    const [isProjectVisibble, setIsProjectVisibble] = useState(false)
    const [isViewVisibble, setIsViewVisibble] = useState(false)
    const { project, setProject } = useContext(ProjectContext)
    const { selectedTeam, setSelectedTeam, updateSelectedTeam, getCurrentProjects } = useContext(TeamContext)
    const params = useParams()
    const history = useHistory()
    const socket = useSocket()
    const { getProjectInfo } = useProjectsServices()

    const getData = useCallback(async () => {
        const data = await getProjectInfo(params.projectid)
        setProject(data)
    }, [getProjectInfo, params, setProject])

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
            setSelectedTeam('Select')
            return
        }

        if (selectedTeam === 'Select') {
            const teamId = params.teamid
            updateSelectedTeam(teamId)
        }

        if (window.location.href.includes('project')) {
            setIsViewVisibble(true)
            setIsProjectVisibble(true)
            getCurrentProjects(params.teamid)

            if (project === null || project._id !== params.projectid) {
                getData()
            }
        }
    }, [getData, params, params.teamid, project, selectedTeam, setSelectedTeam, updateSelectedTeam, getCurrentProjects])

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

    if (window.location.href.includes('project') && !project) {
        return null
    }

    return (
        <header className={`${styles.navigation} ${isAsideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>
                    <TeamDropdown />
                    {isProjectVisibble && <ProjectDropdown />}
                    {isViewVisibble && <ViewDropdown />}
                </div>

                <div className={`${styles.links} ${styles.font}`}>
                    <SearchField isAsideOn={isAsideOn} />
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    )
}

export default Header
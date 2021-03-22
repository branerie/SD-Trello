import React, { useState, useContext, useEffect, useCallback } from 'react'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import Title from '../../components/Title'
import MyTasksProject from '../../components/MyTasksProject'
import ButtonCleanTitle from '../../components/ButtonCleanTitle'
import ButtonClean from '../../components/ButtonClean'
import useUserServices from '../../services/useUserServices'
import myTasks from '../../images/my-tasks/my-tasks.svg'

const MyTasksPage = () => {
    const { user, setUser } = useContext(UserContext)
    const [projects, setProjects] = useState([])
    const [isShownOldProjects, setIsShownOldProjects] = useState(false)
    const { getUserTasks } = useUserServices()
    const socket = useSocket()

    const selectTeam = useCallback(async(teamId) => {
        const data = await getUserTasks(teamId)

        if (data === 'Team not found') return

        setProjects(data)

        if (teamId !== user.lastTeamSelected) {
            const updatedUser = { ...user, lastTeamSelected: teamId }
            setUser(updatedUser)
        }
    }, [user, getUserTasks, setUser])

    useEffect(() => {
        if (!user.lastTeamSelected || !socket) return
        
        socket.on('task-team-updated', taskTeamUpdate)
        socket.on('task-update-team', (teamId) => {

            if (teamId === user.lastTeamSelected) {
                selectTeam(teamId)
            }
        })

        socket.emit('task-team-join', user.lastTeamSelected)

        return () => {
            socket.off('task-team-updated')
            socket.off('task-update-team')
        }
    }, [socket, selectTeam, user.lastTeamSelected])

    useEffect(() => {
        
        if (user.lastTeamSelected) {
            selectTeam(user.lastTeamSelected)
        }
    }, [selectTeam, user.lastTeamSelected])

    function taskTeamUpdate(projects) {
        setProjects(projects)
    }

    return (
        <PageLayout>
            <Title title='My Tasks' />
            <div className={styles['button-container']}>
                <div className={styles['team-buttons']}>
                    <span className={styles.title}>Teams:</span>
                    {user.teams.map(team => {
                        return <ButtonCleanTitle
                            key={team._id}
                            title={team.name}
                            onClick={() => selectTeam(team._id)}
                            className={`${styles.teams} ${user.lastTeamSelected === team._id && styles.selected}`}
                        />
                    })}
                </div>
                <ButtonClean
                    className={`${styles.teams} ${styles['projects-button']}`}
                    title={isShownOldProjects ? 'Current Projects' : 'Old Projects'}
                    onClick={() => setIsShownOldProjects(!isShownOldProjects)}
                />
            </div>
            {user.lastTeamSelected 
                ? <div className={styles.box}>
                    {projects.length === 0 
                        ? <div className={styles.title}>There are no current tasks</div> 
                        : projects.filter(p => isShownOldProjects === !!(p.isFinished))
                            .reverse()
                            .map(project => {
                                return (
                                    <MyTasksProject project={project} teamId={user.lastTeamSelected} />
                                )
                            })
                    }
                 </div>
                : <div className={styles.title}>Select a team</div>
            }
            {(!user.lastTeamSelected || projects.length === 0) &&
                <div className={styles.pic}>
                    <img src={myTasks} alt='' />
                </div>
            }
        </PageLayout>
    )
}

export default MyTasksPage
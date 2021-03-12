import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import Title from '../../components/Title'
import UserContext from '../../contexts/UserContext'
import styles from './index.module.css'
import myTasks from '../../images/my-tasks/my-tasks.svg'
import { useSocket } from '../../contexts/SocketProvider'
import MyTasksTask from '../../components/MyTasksTask'
import ButtonCleanTitle from '../../components/ButtonCleanTitle'
import ButtonClean from '../../components/ButtonClean'
import useUserServices from '../../services/useUserServices'

const MyTasksPage = () => {
    const { user, setUser } = useContext(UserContext)
    const [projects, setProjects] = useState([])
    const [showOldProjects, setShowOldProjects] = useState(false)
    const { getUserTasks } = useUserServices()
    const socket = useSocket()


    const selectTeam = useCallback(async (teamId) => {
        const data = await getUserTasks(teamId)
        if (data === 'Team not found') return
        setProjects(data)
        if (teamId !== user.lastTeamSelected) {
            const updatedUser = { ...user }
            updatedUser.lastTeamSelected = teamId
            setUser({
                ...updatedUser,
                loggedIn: true
            })
        }
    }, [user, getUserTasks, setUser])

    useEffect(() => {
        if (!user.lastTeamSelected || socket == null) return

        const id = user.lastTeamSelected

        socket.on('task-team-updated', taskTeamUpdate)
        socket.on('task-update-team', (teamId) => {
            if (teamId === id) {
                selectTeam(teamId)
            }
        })

        socket.emit('task-team-join', id)
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
                    title={showOldProjects ? 'Current Projects' : 'Old Projects'}
                    onClick={() => setShowOldProjects(!showOldProjects)}
                />
            </div>
            {!user.lastTeamSelected ? <div className={styles.title}>Select a team</div> :
                <div className={styles.box}>
                    {projects.length === 0 ? <div className={styles.title}>There is no current tasks</div> :
                        projects.filter(!showOldProjects ? (p => (p.isFinished === false) || (p.isFinished === undefined))
                            :
                            (p => (p.isFinished === true)))
                            .reverse()
                            .map(project => {
                                return (
                                    <div key={project._id} className={styles.project}>
                                        <div className={styles['project-name']}>
                                            <Link to={`/project-board/${user.lastTeamSelected}/${project._id}`} className={styles.link}>
                                                <span className={styles.bold}>Project:</span> {project.name}
                                            </Link>
                                        </div>
                                        <div className={`${styles.header} ${styles.raw}`}>
                                            <div className={styles.list}>List:</div>
                                            <div className={styles.container}>
                                                <div className={styles.task}>Task:</div>
                                                <div className={styles.progress}>Progress (%):</div>
                                                <div className={styles.days}>Days Till End:</div>
                                            </div>
                                        </div>
                                        { project.lists.map(list => {
                                            return (
                                                <div key={list._id} className={styles.raw}>
                                                    <div className={styles.list}>{list.name}</div>
                                                    <div className={styles['task-container']}>
                                                        {list.cards.map(card => {
                                                            return (
                                                                <MyTasksTask
                                                                    key={card._id}
                                                                    teamId={user.lastTeamSelected}
                                                                    project={project}
                                                                    list={list}
                                                                    card={card}
                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })
                    }
                </div>
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
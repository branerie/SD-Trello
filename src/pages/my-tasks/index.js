import React, { useState, useContext, useEffect, useCallback } from "react"
import { Link, useHistory } from "react-router-dom"
import ButtonClean from "../../components/button-clean"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import UserContext from "../../contexts/UserContext"
import getCookie from "../../utils/cookie"
import styles from './index.module.css'
import myTasks from '../../images/my-tasks/my-tasks.svg'
import { useSocket } from "../../contexts/SocketProvider"
import MyTasksTask from "../../components/my-tasks-task"
import ButtonGrey from "../../components/button-grey"

const MyTasksPage = () => {
    const userContext = useContext(UserContext)
    const [projects, setProjects] = useState([])
    const [showOldProjects, setShowOldProjects] = useState(false)

    const history = useHistory()
    const socket = useSocket()

    const selectTeam = useCallback(async (teamId) => {

        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/user/tasks/${teamId}`, {
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
            setProjects(data)
            if (teamId !== userContext.user.lastTeamSelected) {
                const user = { ...userContext.user }
                user.lastTeamSelected = teamId
                userContext.setUser({
                    ...user,
                    loggedIn: true
                })
            }
        }
    }, [history, userContext])

    useEffect(() => {
        if (!userContext.user.lastTeamSelected || socket == null) return

        const id = userContext.user.lastTeamSelected

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
    }, [socket, selectTeam, userContext.user.lastTeamSelected])

    useEffect(() => {
        if (userContext.user.lastTeamSelected) {
            selectTeam(userContext.user.lastTeamSelected)
        }
    }, [selectTeam, userContext.user.lastTeamSelected])

    function taskTeamUpdate(projects) {
        setProjects(projects)
    }

    return (
        <PageLayout>
            <Title title='My Tasks' />
            <div className={styles['button-container']}>
            <div className={styles['team-buttons']}>
                <span className={styles.title}>Teams:</span>
                {userContext.user.teams.map(team => {
                    return (<ButtonClean
                        key={team._id}
                        title={team.name}
                        onClick={() => selectTeam(team._id)}
                        className={`${styles.teams} ${userContext.user.lastTeamSelected === team._id && styles.selected}`}
                    />)
                })}
            </div>
            <div className={styles['projects-btn-div']}>
                <ButtonClean className={`${styles.teams} ${styles['projects-button']}`}  title={showOldProjects? 'Current Projects': "Old Projects"} onClick={()=> setShowOldProjects(!showOldProjects)} />
            </div>
            </div>
            { !userContext.user.lastTeamSelected ? <div className={styles.title}>Select a team</div> :
                <div className={styles.box}>
                    {projects.length === 0 ? <div className={styles.title}>There is no current tasks</div> :
                        projects.filter(!showOldProjects?(p => (p.isFinished === false) || (p.isFinished === undefined)):(p => (p.isFinished === true)))
                            .reverse()
                            .map(project => {
                                return (
                                    <div key={project._id} className={styles.project}>
                                        <div className={styles['project-name']}>
                                            <Link to={`/project-board/${userContext.user.lastTeamSelected}/${project._id}`} className={styles.link}>
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
                                                                    teamId={userContext.user.lastTeamSelected}
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
            { (!userContext.user.lastTeamSelected || projects.length === 0) &&
                <div className={styles.pic}>
                    <img src={myTasks} alt='' />
                </div>
            }
        </PageLayout>
    )
}

export default MyTasksPage
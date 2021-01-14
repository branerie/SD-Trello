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

const MyTasksPage = () => {
    const userContext = useContext(UserContext)
    const [currTeam, setCurrTeam] = useState('')
    const [projects, setProjects] = useState([])
    const history = useHistory()
    const socket = useSocket()

    const selectTeam = useCallback(async (team) => {
        setCurrTeam(team)

        const token = getCookie("x-auth-token")

        const response = await fetch(`/api/user/tasks/${team._id}`, {
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
        }
    }, [history])

    useEffect(() => {
        if (!currTeam || socket == null) return

        const id = currTeam._id

        socket.on('task-team-updated', taskTeamUpdate)
        socket.on('task-update-team', (teamId) => {
            if (teamId === id) {
                const team = { ...currTeam }
                selectTeam(team)
            }
        })

        socket.emit('task-team-join', id)
        return () => socket.off('task-team-updated')
    }, [currTeam, socket, selectTeam])

    function taskTeamUpdate(projects) {
        setProjects(projects)
        console.log('update');
    }

    return (
        <PageLayout>
            <Title title='My Tasks' />
            <div>
                <span className={styles.title}>Teams:</span>
                {
                    userContext.user.teams.map(team => {
                        return (
                            <ButtonClean
                                key={team._id}
                                title={team.name}
                                onClick={() => selectTeam(team)}
                                className={`${styles.filter} ${currTeam._id === team._id && styles.selected}`}
                            />
                        )
                    })
                }
            </div>
            {
                !currTeam ? <div className={styles.title}>Select a team</div> :
                    <div>
                        {
                            projects.length === 0 ? <div className={styles.title}>There is no current tasks</div> :
                                projects.map(project => {
                                    return (
                                        <div key={project._id} className={styles.project}>
                                            <div className={styles['project-name']}>
                                                <Link to={`/project-board/${currTeam._id}/${project._id}`} className={styles.link}>
                                                    <span className={styles.bold}>Project:</span> {project.name}
                                                </Link>
                                            </div>
                                            <div className={`${styles.header} ${styles.card}`}>
                                                <div className={styles.task}>Task:</div>
                                                <div className={styles.list}>List:</div>
                                                <div className={styles.progress}>Progress:</div>
                                                <div className={styles.days}>Days Till End:</div>
                                            </div>
                                            {
                                                project.lists.map(list => {
                                                    return (
                                                        <div key={list._id}>
                                                            {list.cards.map(card => {
                                                                return (
                                                                    <MyTasksTask
                                                                        key={card._id}
                                                                        currTeam={currTeam}
                                                                        project={project}
                                                                        list={list}
                                                                        card={card}
                                                                    />
                                                                )
                                                            })}
                                                        </div>)
                                                })
                                            }
                                        </div>
                                    )
                                })
                        }
                    </div>
            }
            <div>
                <img className={styles.pic} src={myTasks} alt="" width="364px" height="262px" />
            </div>
        </PageLayout>
    )
}

export default MyTasksPage
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

const MyTasksPage = () => {
    const userContext = useContext(UserContext)
    const [currTeam, setCurrTeam] = useState('')
    const [projects, setProjects] = useState([])
    const history = useHistory()
    const socket = useSocket()

    const selectTeam = useCallback(async (team) => {
        console.log(team);
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
            console.log(data);
            setProjects(data)
        }
    }, [history])

    useEffect(() => {
        if (!currTeam || socket == null) return

        const id = currTeam._id

        socket.on('task-team-updated', taskTeamUpdate)
        socket.on('task-update-team', (teamId) => {
            if (teamId === id) {
                const team = {...currTeam}
                selectTeam(team)
            }
        })

        socket.emit('task-team-join', id)
        return () => socket.off('task-team-updated')
    }, [currTeam, socket, selectTeam])

    function taskTeamUpdate(projects) {
        console.log('updateedddd');
        setProjects(projects)
    }

    return (
        <PageLayout>
            <Title title='My Tasks' />
            <div className={styles.align}>
                <span className={styles.title}>Teams:</span>
                {
                    userContext.user.teams.map(team => {
                        return (
                            <ButtonClean
                                key={team._id}
                                title={team.name}
                                onClick={() => selectTeam(team)}
                                className={`${styles.filter} ${currTeam._id !== team._id ? '' : styles.selected}`}
                            />
                        )
                    })
                }
            </div>
            {
                projects.length === 0 ? <div className={styles['title']}>There is no current tasks</div> :
                    projects.map(project => {
                        return (
                            <div key={project._id} className={styles.project}>
                                <div className={styles['project-name']}>
                                    <Link to={`/project-board/${currTeam._id}/${project._id}`} className={styles.link}>
                                        <span className={styles.bold}>Project:</span> {project.name}
                                    </Link>
                                </div>
                                {
                                    project.lists.map(list => {
                                        return (
                                            <div key={list._id}>
                                                {list.cards.map(card => {
                                                    return (
                                                        <div key={card._id} className={styles.card}>
                                                            <div><span className={styles.bold}>Task:</span> {card.name}</div>
                                                            <div><span className={styles.bold}>Progress:</span> {card.progress}</div>
                                                            <span className={styles.date}>
                                                                <span className={styles.bold}>Days Remaining:</span>
                                                                {Math.ceil((Date.parse(card.dueDate) - Date.now())/ 1000/3600/24)}
                                                            </span>
                                                            <div><span className={styles.bold}>List:</span> {list.name}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>)
                                    })
                                }
                            </div>
                        )
                    })
            }
            <div>
                <img className={styles.pic} src={myTasks} alt="" width="364px" height="262px" />
            </div>
        </PageLayout>
    )
}

export default MyTasksPage
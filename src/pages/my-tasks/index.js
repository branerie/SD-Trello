import React, { useState, useContext } from "react"
import { useHistory } from "react-router-dom"
import ButtonClean from "../../components/button-clean"
import PageLayout from "../../components/page-layout"
import UserContext from "../../contexts/UserContext"
import getCookie from "../../utils/cookie"
import styles from './index.module.css'

const MyTasksPage = () => {
    const userContext = useContext(UserContext)
    const [currTeam, setCurrTeam] = useState('')
    const [projects, setProjects] = useState([])
    const history = useHistory()

    async function selectTeam(team) {
        setCurrTeam(team)

        const token = getCookie("x-auth-token");

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
    }



    return (
        <PageLayout>
            Teams:
            {
                userContext.user.teams.map(team => {
                    return (
                        <ButtonClean
                            key={team._id}
                            title={team.name}
                            onClick={() => selectTeam(team)}
                            className={`${styles.filter} ${currTeam._id !== team._id ? styles['filter-off'] : ''}`}
                        />
                    )
                })
            }
            {
                projects.length === 0 ? <div className={styles['title']}>There is no current tasks</div> :
                projects.map(project => {
                    return (
                        <div key={project._id} className={styles.project}>
                            <div className={styles['title']}>Project: {project.name}</div>
                            {
                                project.lists.map(list => {
                                    return (
                                        <div key={list._id}>
                                            {list.cards.map(card => {
                                                return (
                                                    <div key={card._id} className={styles.card}>
                                                        <div>Task: {card.name}</div>
                                                        <div>Progress: {card.progress}</div>
                                                        <div>Due Date: {card.dueDate}</div>
                                                        <div>List: {list.name}</div>
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
        </PageLayout>
    )
}

export default MyTasksPage
import React, { useState, useEffect, useContext } from "react"
import styles from './index.module.css'
import PageLayout from "../../components/page-layout"
import Project from '../../components/project'
import Transparent from "../../components/transparent"
import CreateProject from '../../components/create-project'
import TeamContext from "../../contexts/TeamContext"
import { useParams } from "react-router-dom"
import EditTeam from "../../components/edit-team"


const TeamPage = () => {

    const [isVisible, setIsVisible] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const teamContext = useContext(TeamContext)
    const params = useParams()




    useEffect(() => {
        const teamId = params.teamid
        teamContext.getCurrentProjects(teamId)
    })

    return (
        <PageLayout>
            <div>
                {teamContext.currentProjects.map((project, index) => {
                    return (
                        <Project key={project._id} index={index} project={project} />
                    )
                })}
            </div>
            <button className={styles.newProjectButton} onClick={() => setIsVisible(true)} >New Project</button>
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={() => setIsVisible(false)}>
                            <CreateProject />
                        </Transparent>
                    </div> : null
            }
            <button className={styles.newProjectButton} onClick={() => setShowForm(true)} >View Team</button>
            {
                showForm ? 
                (<Transparent hideForm={() => setShowForm(false)}>
                    <EditTeam hideForm={() => { setShowForm(false) }} team={teamContext} />
                </Transparent>) 
                : null
            }
        </PageLayout>
    )
}

export default TeamPage;
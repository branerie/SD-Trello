import React, { useState, useContext } from "react"
import styles from './index.module.css'
import PageLayout from "../../components/page-layout"
import Project from '../../components/project'
import Transparent from "../../components/transparent"
import CreateProject from '../../components/create-project'
import TeamContext from "../../contexts/TeamContext"
import { useParams } from "react-router-dom"
import EditTeam from "../../components/edit-team"
import TeamMembers from "../../components/team-members"




const TeamPage = () => {

    const [isVisible, setIsVisible] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const params = useParams()
    const teamContext = useContext(TeamContext)
    const teamId = params.teamid








    return (
        <PageLayout>
            <div className={styles.teamContainer}>
                <div className={styles.leftSide}>
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
                   
                </div>
                <div className={styles.rightSideTeam}>
                    <TeamMembers
                        teamId={teamId}
                    />
                     <button className={styles.newProjectButton} onClick={() => setShowForm(true)} >View Team</button>
                    {
                        showForm ?
                            (<Transparent hideForm={() => setShowForm(false)}>
                                <EditTeam hideForm={() => { setShowForm(false) }} />
                            </Transparent>)
                            : null
                    }
                </div>
            </div>
        </PageLayout>
    )
}

export default TeamPage;
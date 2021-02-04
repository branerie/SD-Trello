import React, { useState, useContext, useEffect } from "react"
import styles from './index.module.css'
import PageLayout from "../../components/page-layout"
import Project from '../../components/project'
import Transparent from "../../components/transparent"
import CreateProject from '../../components/create-project'
import { useParams } from "react-router-dom"
import EditTeam from "../../components/edit-team"
import TeamMembers from "../../components/team-members"
import pic1 from '../../images/team-page/pic1.svg'
import UserContext from "../../contexts/UserContext"

const TeamPage = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
    const [projects, setProjects] = useState([])
    const [members, setMembers] = useState([])
    const [invited, setInvited] = useState([])
    const params = useParams()
    const userContext = useContext(UserContext)

    useEffect(() => {
        userContext.user.teams.forEach(t => {
            if (t._id === params.teamid) {
                setCurrTeam(t)
                setProjects(t.projects)
                setMembers(t.members)
                setInvited(t.requests)
            }
        })    
    }, [userContext.user.teams, params.teamid])

    return (
        <PageLayout>
            <div className={styles.teamContainer}>
                <div className={styles.leftSide}>
                    <div>
                        {projects.map((project, index) => {
                            return (
                                <Project key={project._id} index={index} project={project} />
                            )
                        })}
                    </div>
                    <button className={styles.newProjectButton} onClick={() => setIsVisible(true)} >New Project</button>
                    {
                        isVisible &&
                        <Transparent hideForm={() => setIsVisible(false)}>
                            <CreateProject />
                        </Transparent>
                    }
                </div>

                <div className={styles.rightSde}>
                    <div className={styles.rightSideTeam}>
                        <TeamMembers
                            members={members} invited={invited}
                        />
                        <button className={styles.newProjectButton} onClick={() => setShowForm(true)} >View Team</button>
                        {
                            showForm &&
                            <Transparent hideForm={() => setShowForm(false)}>
                                <EditTeam currTeam={currTeam} hideForm={() => { setShowForm(false) }} />
                            </Transparent>
                        }
                    </div>

                    <div className={styles.pic1}>
                        <img src={pic1} alt="" />
                    </div>

                </div>
            </div>
        </PageLayout>
    )
}

export default TeamPage;
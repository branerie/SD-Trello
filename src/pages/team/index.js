import React, { useState, useContext, useEffect } from "react"
import styles from './index.module.css'
import PageLayout from "../../components/page-layout"
import Project from '../../components/project'
import Transparent from "../../components/transparent"
import CreateProject from '../../components/create-project'
import { useParams } from "react-router-dom"
import EditTeam from "../../components/edit-team"
import TeamMembers from "../../components/team-members"
import UserContext from "../../contexts/UserContext"
import TeamContext from "../../contexts/TeamContext"




const TeamPage = () => {

    const [isVisible, setIsVisible] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [members, setMembers] = useState([])
    const [invited, setInvited] = useState([])
    const [projects, setProjects] = useState([])
    const [currTeamUser, setCurrteamUser] = useState({})
    const params = useParams()
    const userContext = useContext(UserContext)
    const teamContext = useContext(TeamContext)

    const teamId = params.teamid

    useEffect(() => {
        let currTeam = {}
        let found

        userContext.user.teams.forEach(t => {
            if (t._id === teamId) {
                currTeam = t
                setCurrteamUser(t)
                found = true
            } 
        })
        if(!found) {
            teamContext.teams.forEach(t => {
                if (t._id === teamId) {
                    currTeam = t
                    setCurrteamUser(t)
                }
            })
        }
        setMembers(currTeam.members)
        setInvited(currTeam.requests)
        setProjects(currTeam.projects)
    }, [teamId, userContext.user.teams, params,teamContext.teams])


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
                        members={members} invited={invited}
                    />
                    <button className={styles.newProjectButton} onClick={() => setShowForm(true)} >View Team</button>
                    {
                        showForm ?
                            (<Transparent hideForm={() => setShowForm(false)}>
                                <EditTeam currTeam={currTeamUser} hideForm={() => { setShowForm(false) }} />
                            </Transparent>)
                            : null
                    }
                </div>
            </div>
        </PageLayout>
    )
}

export default TeamPage;
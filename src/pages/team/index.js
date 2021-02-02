import React, { useState, useContext, useEffect, useCallback } from "react"
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
import pic1 from '../../images/team-page/pic1.svg'
import { useSocket } from "../../contexts/SocketProvider"

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
    const socket = useSocket()
    const teamId = params.teamid


    const teamUpdate = useCallback(() => {
        let currTeam = {}
        let found
        teamContext.teams.forEach(t => {
            if (t._id === teamId) {
                currTeam = t
                setCurrteamUser(t)
                found = true
            }
        })
        if (!found) {
            return
        }
        setMembers(currTeam.members)
        setInvited(currTeam.requests)
        setProjects(currTeam.projects)
    }, [teamId, teamContext.teams])



    useEffect(() => {

        if (socket == null) return

        socket.on('team-update', teamUpdate)
        return () => socket.off('team-updated')
    }, [socket, teamUpdate, params, teamContext.teams, userContext, teamId])

    useEffect(() => {
        teamUpdate()
    }, [teamUpdate])


    // useEffect(() => {
    //     let currTeam = {}
    //     let found        
    //     teamContext.teams.forEach(t => {
    //         if (t._id === teamId) {
    //             currTeam = t
    //             setCurrteamUser(t)
    //             found = true
    //         }
    //     })
    //     if (!found) {
    //         return
    //     }        

    //     setMembers(currTeam.members)
    //     setInvited(currTeam.requests)
    //     setProjects(currTeam.projects)
    // }, [teamContext.teams, teamId, teamContext, userContext])


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

                <div className={styles.rightSde}>
                    <div className={styles.rightSideTeam}>
                        <TeamMembers
                            members={members} invited={invited}
                        />
                        <button className={styles.newProjectButton} onClick={() => setShowForm(true)} >View Team</button>
                        {
                            showForm &&
                            <Transparent hideForm={() => setShowForm(false)}>
                                <EditTeam currTeam={currTeamUser} hideForm={() => { setShowForm(false) }} />
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
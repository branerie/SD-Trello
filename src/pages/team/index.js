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
import ButtonGrey from "../../components/button-grey"
import useUpdateUserLastTeam from "../../utils/useUpdateUserLastTeam"

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

    }, [userContext, params])
    
    useUpdateUserLastTeam(params.teamid)

    return (
        <PageLayout>
            <div className={styles.container}>
                {
                    isVisible &&
                    <Transparent hideForm={() => setIsVisible(false)}>
                        <CreateProject />
                    </Transparent>
                }
                {
                    showForm &&
                    <Transparent hideForm={() => setShowForm(false)}>
                        <EditTeam currTeam={currTeam} hideForm={() => { setShowForm(false) }} />
                    </Transparent>
                }
                <div className={styles.pic1}>
                    <img className={styles.picture} src={pic1} alt="" />
                </div>


                <div className={styles['left-side']}>
                    <div>
                        {projects.map((project, index) => {
                            return (
                                <Project key={project._id} index={index} project={project} />
                            )
                        })}
                    </div>

                </div>

                <div className={styles['right-side']}>
                    <div className={styles['right-side-team']}>
                        <TeamMembers
                            members={members} invited={invited}
                        />
                        <ButtonGrey className={styles['new-project-button']} title={'View Team'} onClick={() => setShowForm(true)} />
                        <ButtonGrey title={'New Project'} onClick={() => setIsVisible(true)} />


                    </div>



                </div>


            </div>

        </PageLayout>
    )
}

export default TeamPage;
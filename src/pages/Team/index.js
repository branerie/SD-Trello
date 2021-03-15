import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import Project from '../../components/Project'
import Transparent from '../../components/Transparent'
import CreateProject from '../../components/CreateProject'
import EditTeam from '../../components/EditTeam'
import TeamMembers from '../../components/TeamMembers'
import UserContext from '../../contexts/UserContext'
import ButtonGrey from '../../components/ButtonGrey'
import useUpdateUserLastTeam from '../../utils/useUpdateUserLastTeam'
import teamPagePicture from '../../images/team-page/pic1.svg'

const TeamPage = () => {
    const [isCreateProjectFormVisible, setIssCreateProjectFormVisible] = useState(false)
    const [isEditTeamFormVisible, setIsEditTeamFormVisible] = useState(false)
    const [areOldProjectsShown, setAreOldProjectsShown] = useState(false)
    const [currTeam, setCurrTeam] = useState({})
    const [projects, setProjects] = useState([])
    const [members, setMembers] = useState([])
    const [invited, setInvited] = useState([])
    const { user } = useContext(UserContext)
    const { teamid } = useParams()


    useEffect(() => {
        user.teams.forEach(team => {
            if (team._id === teamid) {
                setCurrTeam(team)
                setProjects(team.projects)
                setMembers(team.members)
                setInvited(team.requests)
            }
        })
    }, [user, teamid])

    useUpdateUserLastTeam(teamid)

    return (
        <PageLayout>
            {
                isCreateProjectFormVisible &&
                <Transparent hideForm={() => setIssCreateProjectFormVisible(false)}>
                    <CreateProject />
                </Transparent>
            }
            {
                isEditTeamFormVisible &&
                <Transparent hideForm={() => setIsEditTeamFormVisible(false)}>
                    <EditTeam currTeam={currTeam} hideForm={() => { setIsEditTeamFormVisible(false) }} />
                </Transparent>
            }
            <div className={styles.container}>
                <div className={styles['team-page-picture']}>
                    <img className={styles.picture} src={teamPagePicture} alt='' />
                </div>
                <div className={styles['left-side']}>
                    <div>
                        <div className={styles.title}>
                            {areOldProjectsShown ? 'Old Projects' : 'Current Projects:'}
                        </div>
                        {
                            projects.filter(areOldProjectsShown ?
                                (p => (p.isFinished === true))
                                :
                                (p => ((p.isFinished === false) || (p.isFinished === undefined))))
                                .reverse().map((project) => {
                                    return (
                                        <Project
                                            key={project._id}
                                            project={project}
                                        />)
                                })
                        }
                    </div>
                </div>

                <div className={styles['right-side']}>
                    <div className={styles['right-side-team']}>
                        <TeamMembers
                            members={members}
                            invited={invited}
                        />
                        <div className={styles['button-div']}>
                            <ButtonGrey
                                className={styles['team-page-button']}
                                title={'View Team'}
                                onClick={() => setIsEditTeamFormVisible(true)}
                            />
                            <ButtonGrey
                                className={styles['team-page-button']}
                                title={'New Project'}
                                onClick={() => setIssCreateProjectFormVisible(true)}
                            />
                            <ButtonGrey
                                className={styles['team-page-button']}
                                title={!areOldProjectsShown ? 'Old Projects' : 'Current Projects'}
                                onClick={() => setAreOldProjectsShown(!areOldProjectsShown)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default TeamPage;
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import Transparent from '../../components/Transparent'
import CreateTeam from '../../components/CreateTeam'
import Title from '../../components/Title'
import ButtonGreyTitle from '../../components/ButtonGreyTitle'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import homePagePicture from '../../images/home-page-pic.svg'
import MyTeamsMenu from '../../components/MyTeamsMenu'


const Home = () => {
    const history = useHistory()
    const { user } = useContext(UserContext)
    const [isTeamFormShown, setIsTeamFormShown] = useState(false)
    const [areUserTeamsShown, setAreUserTeamsShown, dropdownRef] = useDetectOutsideClick()
    const userName = user.username
    const userTeams = user.teams
    const userId = user._id
    const userRecentProjects = user.recentProjects


    const goToTeamPage = (teamId) => {
        history.push(`/team/${teamId}`)
    }

    const goToProjectPage = (projectId) => {
        userTeams.map(team => {
            return (
                team.projects.forEach(project => {
                    if (project._id === projectId) {
                        history.push(`/project-board/${team._id}/${projectId}`)
                    }
                })
            )
        })
    }


    return (
        <PageLayout>
            <>
                {
                    isTeamFormShown &&
                    <Transparent hideForm={() => setIsTeamFormShown(false)}>
                        <CreateTeam hideForm={() => { setIsTeamFormShown(false) }} />
                    </Transparent>
                }
            </>
            <Title title='Home' />
            <div className={styles.container}>
                <div className={styles['left-buttons']}>
                    <ButtonGreyTitle
                        className={styles['navigate-buttons']}
                        title={'My Tasks'}
                        onClick={() => history.push(`/my-tasks/${userId}`)}
                    />

                    <ButtonGreyTitle
                        className={styles['navigate-buttons']}
                        title={'My Teams'}
                        onClick={() => setAreUserTeamsShown(!areUserTeamsShown)}
                    />

                    <div className={styles['select-team-container']} ref={dropdownRef}>
                        {
                            areUserTeamsShown &&
                            <MyTeamsMenu userTeams={userTeams} goToTeamPage={goToTeamPage} />
                        }
                    </div>

                    <ButtonGreyTitle
                        className={styles['navigate-buttons']}
                        title={'Create New Team'}
                        onClick={() => setIsTeamFormShown(true)}
                    />
                </div>

                <div className={styles['pic-container']}>
                    <img className={styles.pic1} src={homePagePicture} alt='' />

                    <div className={styles['welcome-user']}>
                        {`Welcome ${userName}!`}
                    </div>

                    <ButtonGreyTitle
                        className={styles['navigate-buttons']}
                        title={'Get Started'}
                        onClick={() => history.push(`${/get-started/}`)}
                    />
                </div>

                <div className={styles['right-buttons']}>
                    {
                        userRecentProjects &&
                        <>
                            <div >Recent projects:</div>
                            {
                                userRecentProjects.slice(0).reverse().map((project) => {
                                    return (
                                        <div key={project._id}>
                                            <ButtonGreyTitle
                                                className={styles['navigate-buttons']}
                                                title={project.name}
                                                onClick={() => goToProjectPage(project._id)}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </>
                    }
                </div>
            </div>
        </PageLayout>
    )
}

export default Home
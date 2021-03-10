import React, { useContext, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import Transparent from '../../components/Transparent'
import CreateTeam from '../../components/CreateTeam'
import Title from '../../components/Title'
import UserContext from '../../contexts/UserContext'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import ButtonGreyTitle from '../../components/ButtonGreyTitle'
import pic1 from '../../images/home-page-pic.svg'
import MyTeamsMenu from '../../components/MyTeamsMenu'


const Home = () => {
  const dropdownRef = useRef(null)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showTeamsVisibleForm, setShowTeamsVisibleForm] = useDetectOutsideClick(dropdownRef)
  const userName = userContext.user.username
  const userTeams = userContext.user.teams
  const userId = userContext.user._id
  const userRecentProjects = userContext.user.recentProjects


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
          showTeamForm &&
          <Transparent hideForm={() => setShowTeamForm(false)}>
            <CreateTeam hideForm={() => { setShowTeamForm(false) }} />
          </Transparent>
        }
      </>

      <Title title='Home' />

      <div className={styles.container}>

        <div className={styles['left-buttons']}>
          <ButtonGreyTitle className={styles['navigate-buttons']} title={'My Tasks'}
            onClick={() => history.push(`/my-tasks/${userId}`)} />

          <ButtonGreyTitle className={styles['navigate-buttons']} title={'My Teams'}
            onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)} />

          <div className={styles['select-team-container']} ref={dropdownRef}>
            {
              showTeamsVisibleForm &&
              <MyTeamsMenu userTeams={userTeams} goToTeamPage={goToTeamPage} />
            }
          </div>

          <ButtonGreyTitle className={styles['navigate-buttons']} title={'Create New Team'}
            onClick={() => setShowTeamForm(true)} />
        </div>

        <div className={styles['pic-container']}>
          <img className={styles.pic1} src={pic1} alt='' />

          <div className={styles['welcome-user']}>
            {`Welcome ${userName}!`}
          </div>

          <ButtonGreyTitle className={styles['navigate-buttons']} title={'Get Started'}
            onClick={() => history.push(`/get-started/`)} />
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
                      <ButtonGreyTitle className={styles['navigate-buttons']} title={project.name}
                        onClick={() => goToProjectPage(project._id)} />
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
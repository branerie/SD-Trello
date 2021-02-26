import React, { useContext, useState, useRef } from "react"
import { useHistory } from "react-router-dom"
import CreateTeam from "../../components/create-team"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import Transparent from "../../components/transparent"
import UserContext from "../../contexts/UserContext"
import styles from './index.module.css'
import pic1 from '../../images/home-page-pic.svg'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import ButtonGrey from "../../components/button-grey"
import ButtonGreyTitle from "../../components/button-grey-title"


const Home = () => {
  const dropdownRef = useRef(null)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showTeamsVisibleForm, setShowTeamsVisibleForm] = useDetectOutsideClick(dropdownRef)
  const userName = userContext.user.username
  const userTeams = userContext.user.teams
  const userId = userContext.user._id
  const recentProjects = userContext.user.recentProjects


  const goToTeamPage = (teamId) => {
    history.push(`/team/${teamId}`)
  }

  const goToProject = (projectId) => {

    userTeams.map(t => {
      return (t.projects.forEach(element => {
        if (element._id === projectId) {
          history.push(`/project-board/${t._id}/${projectId}`)
        }
      }))
    })

  }




  return (
    <PageLayout>
      <div>
        {
          showTeamForm ? (<Transparent hideForm={() => setShowTeamForm(false)}>
            <CreateTeam hideForm={() => { setShowTeamForm(false) }} ></CreateTeam>
          </Transparent>) : null
        }
      </div>

      <Title title='Home' />
      <div className={styles.container}>

        <span className={styles['left-buttons']}>

          <div>
            <ButtonGreyTitle className={styles['navigate-buttons']} title={'My Tasks'} onClick={() => history.push(`/my-tasks/${userId}`)} />

          </div>

          <div>
            {/* <div className={styles['my-teams-container']}> */}
            <ButtonGreyTitle className={styles['navigate-buttons']} title={'My Teams'} onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)} />


            {/* </div> */}
            <span>
              <div className={styles['select-team-container']}>
                {
                  showTeamsVisibleForm ?
                    <div className={styles['teams-home']} ref={dropdownRef}>
                      {
                        userTeams.length > 0
                          ? userTeams.map((t, index) => {
                            return (
                              <span key={index}>
                                <div
                                  className={styles['navigate-buttons-teams']}
                                  onClick={() => goToTeamPage(t._id)}
                                  title={t.name}
                                >
                                  {t.name}</div>

                              </span>
                            )
                          }
                          )
                          : "You haven't joined any teams yet"
                      }
                    </div>
                    : null
                }
              </div>
            </span>
          </div>

          <div>
            <ButtonGreyTitle className={styles['navigate-buttons']} title={'Create New Team'} onClick={() => setShowTeamForm(true)} />

          </div>

        </span>

        <div className={styles['pic-container']}>
          <img className={styles.pic1} src={pic1} alt="" />
          <div className={styles['welcome-user']}>{`Welcome ${userName}!`}</div>
        </div>

        <span className={styles['right-buttons']}>
          {
            (recentProjects) ?
              <div>
                <div >{`Recent projects:`}</div>
                {
                  recentProjects.slice(0).reverse().map((p, index) => {
                    return (
                      <div key={p._id}>
                        <ButtonGreyTitle className={styles['navigate-buttons']} title={p.name} onClick={() => goToProject(p._id)} />
                      </div>
                    )
                  })
                }


              </div>
              : null
          }
        </span>
      </div>
    </PageLayout>
  )
}

export default Home
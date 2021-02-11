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


const Home = () => {
  const dropdownRef = useRef(null)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showTeamsVisibleForm, setShowTeamsVisibleForm] = useDetectOutsideClick(dropdownRef)
  const userName = userContext.user.username
  const userTeams = userContext.user.teams
  const userId = userContext.user._id

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




  const recentProjects = userContext.user.recentProjects

  // const goToProjectPage = (projectId, teamId) => {
  //   history.push(`/project-board/${teamId}/${projectId}`)
  // }

  // const showTeamProjects = (team) => {
  //   console.log(team);
  //   team.projects.map((p, index) => {
  //     return (
  //       <div key={index} onClick={() => goToProjectPage(p._id, team._id)}>{p.name}</div>
  //     )
  //   })
  // }

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

        <span className={styles.leftButtons}>

          <div>
            <ButtonGrey className={styles.navigateButtons} title={'My Tasks'} onClick={() => history.push(`/my-tasks/${userId}`)} />
            {/* <button className={styles.navigateButtons}
              onClick={() => history.push(`/my-tasks/${userId}`)}
            >My Tasks</button> */}
          </div>

          <div>
            <div className={styles.myTeamsContainer}>
              <ButtonGrey className={styles.navigateButtons} title={'My Teams'} onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)} />

              {/* < button onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)}
                // title='Create Team' 
                // className={styles.teamNames}
                className={styles.myTeamButton}>
                  My Teams
              </ button> */}

            </div>
            <div className={styles.teamsPopUp}>
              <div className={styles.selectTeamContainer}>
                {
                  showTeamsVisibleForm ?
                    <div className={styles.teamsHome} ref={dropdownRef}>
                      {
                        userTeams.length > 0
                          ? userTeams.map((t, index) => {
                            return (
                              <span key={index}>
                                <div
                                  className={styles.navigateButtonsTeams}
                                  onClick={() => goToTeamPage(t._id)}

                                >{t.name}</div>

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
            </div>
          </div>

          <div>
            <ButtonGrey className={styles.navigateButtons} title={'Create New Team'} onClick={() => setShowTeamForm(true)} />
            {/* < button onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              className={styles.navigateButtons}
            >Create New Team</ button> */}
          </div>

        </span>

        <div className={styles.picContainer}>
          <img className={styles.pic1} src={pic1} alt="" />
          <div className={styles.welcomeUser}>{`Welcome ${userName}!`}</div>
        </div>

        <span className={styles.rightButtons}>
          {
            (recentProjects) ?
              <div>
                <div >{`Recent projects:`}</div>
                {
                  recentProjects.slice(0).reverse().map((p, index) => {
                    return (
                      <div key={p._id}>
                        <ButtonGrey className={styles.navigateButtons} title={p.name} onClick={() => goToProject(p._id)} />
                        {/* <button className={styles.navigateButtons} onClick={() => goToProject(p._id)}>{p.name}</button> */}
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
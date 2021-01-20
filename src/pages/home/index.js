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


const Home = () => {
  const dropdownRef = useRef(null)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showTeamsVisibleForm, setShowTeamsVisibleForm] = useDetectOutsideClick(dropdownRef)
  const userName = userContext.user.username
  const userTeams = userContext.user.teams
  const userId = userContext.user._id

  console.log(userContext.user);

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
      <div className={styles.welcomeUser}>{`Welcome ${userName}!`}</div>
      <div className={styles.container}>

        <span className={styles.leftButtons}>

          <div>
            <button className={styles.navigateButtons}
              onClick={() => history.push(`/my-tasks/${userId}`)}
            >My Tasks</button>
          </div>

          <div>
            <div>
              < button onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)}
                // title='Create Team' 
                // className={styles.teamNames}
                className={styles.navigateButtons}
              >My Teams</ button>
            </div>
            <div>
              {
                showTeamsVisibleForm ?
                  <div className={styles.teamsHome} ref={dropdownRef}>
                    {
                      userTeams.map((t, index) => {
                        return (
                          <span key={index}>
                            {/* <div> */}
                            <div 
                              // className={styles.teamNames}
                              className={styles.navigateButtonsTeams}
                              onClick={() => goToTeamPage(t._id)}

                            >{t.name}</div>
                            {/* <div className={styles.teams}>
                    Projects:
                    {
                      t.projects.map((p, index) => {
                        return (
                          <div key={index} className={styles.navigateButtons} onClick={() => goToProjectPage(p._id, t._id)}>{p.name}</div>
                        )
                      })
                    }
                  </div> */}
                            {/* </div> */}
                          </span>
                        )
                      }
                      )
                    }
                  </div>
                  : null

              }
            </div>
          </div>

          <div>
            < button onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              className={styles.navigateButtons}
            >Create New Team</ button>
          </div>

        </span>

        <span className={styles.picContainer}>
          <img className={styles.pic1} src={pic1} alt="" />
        </span>

        <span className={styles.rightButtons}>
          {
            (recentProjects) ?
              <div>
                <div >{`Recent projects:`}</div>
                {
                  recentProjects.slice(0).reverse().map((p, index) => {
                    return (
                      <button key={p._id} className={styles.navigateButtons} onClick={()=>goToProject(p._id)}>{p.name}</button>
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
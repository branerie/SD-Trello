import React, { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import ButtonClean from "../../components/button-clean"
import CreateTeam from "../../components/create-team"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import Transparent from "../../components/transparent"
import UserContext from "../../contexts/UserContext"
import styles from './index.module.css'
import pic1 from '../../images/home-page-pic.svg'





const Home = () => {
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showTeamsVisibleForm, setShowTeamsVisibleForm] = useState(false)



  const userName = userContext.user.username
  const userTeams = userContext.user.teams
  const userId = userContext.user._id



  const goToTeamPage = (teamId) => {
    history.push(`/team/${teamId}`)
  }

  const goToProjectPage = (projectId, teamId) => {
    history.push(`/project-board/${teamId}/${projectId}`)
  }

  const showTeamProjects = (team) => {
    console.log(team);
    team.projects.map((p, index) => {
      return (
        <div key={index} onClick={() => goToProjectPage(p._id, team._id)}>{p.name}</div>
      )
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
      
        <Title title='Smart Manager' />
        <div >{`Wellcome ${userName}`}</div>
        <div className={styles.container}>
        
        <div className={styles.leftButtons}>          

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
                  <div className={styles.teams}>
                    {
                      userTeams.map((t, index) => {
                        return (
                          <span>
                            {/* <div> */}
                            <button key={index}
                              // className={styles.teamNames}
                              className={styles.navigateButtons}
                              onClick={() => goToTeamPage(t._id)}
                              
                            >{t.name}</button>
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
        
        </div>
        
        <span className={styles.picContainer}>
          <img className={styles.pic1} src={pic1} alt="" />
        </span>

        <span className={styles.rightButtons}>
        <div >{`Recently visited:`}</div>
          <div>
            < button 
            // onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              className={styles.navigateButtons}
            >
              Project 1
              </ button>
          </div>

          <div>
            < button 
            // onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              className={styles.navigateButtons}
            >
              Project 2
              </ button>
          </div>

          <div>
            < button 
            // onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              className={styles.navigateButtons}
            >
              Project 3
              </ button>
          </div>
        </span>
        
        
        </div>



    </PageLayout>
  )
}

export default Home
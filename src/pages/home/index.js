import React, { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import UserContext from "../../contexts/UserContext"
import styles from './index.module.css'




const Home = () => {
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [showTeamForm, setShowTeamForm] = useState(false)



  const userName = userContext.user.username
  const userTeams = userContext.user.teams

  console.log(userContext);


  const goToTeamPage = (teamId) => {
    history.push(`/team/${teamId}`)
  }



  return (
    <PageLayout>
      <Title title={`Wellcome ${userName}`} />
      <div>
        {
          // showTeamForm ? (<Transparent hideForm={() => setShowTeamForm(false)}>
          //   <CreateTeam hideForm={() => { setShowTeamForm(false) }} ></CreateTeam>
          // </Transparent>) : null
        }
      </div>
      <div>
        <p>
          Select team:
      </p>
        <div className={styles.teams}>
          {
            userTeams.map((t, index) => {
              return (
                <div key={index} className={styles.teamNames} onClick={() => goToTeamPage(t._id)}>{t.name}</div>
              )
            }
            )
            // < ButtonClean
            //                             onClick={() => setShowTeamForm(true)}
            //                             title='Create Team'
            //                             className={styles.logout}
            //                         />
          }
        </div>
      </div>





    </PageLayout>
  )
}

export default Home
import React, { useState, useEffect, useCallback, useContext } from "react"
import Loader from "react-loader-spinner"
import { useParams, useHistory } from "react-router-dom"
import PageLayout from "../../components/page-layout"
import styles from './index.module.css'
import pic1 from '../../images/profile-page-pic.svg'
import pen from '../../images/pen.svg'
import authenticateUpdate from '../../utils/authenticate-update';

import Title from "../../components/title"
import UserContext from "../../contexts/UserContext"
import Alert from "../../components/alert"


const ProfilePage = () => {
  const userContext = useContext(UserContext)
  const [userEmail, setUserEmail] = useState(null)
  const [passwordActive, setPaswordActive] = useState(true)
  const [userNameActive, setUserNameActive] = useState(true)
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [rePassword, setRePassword] = useState(null);
  const [alert, setAlert] = useState(false)
  const [showTeamsVisibleForm, setShowTeamsVisibleForm] = useState(false)



  
  const params = useParams()
  const history = useHistory()


  const userName = userContext.user.username
  const userTeams = userContext.user.teams
  const id = params.userid;
  


  const getData = useCallback(async () => {

    const response = await fetch(`/api/user/${id}`)
    if (!response.ok) {
      history.push("/error")
    } else {
      const user = await response.json()
      setUserEmail(user.email)
      
    }
  }, [history, id])



  const handleSubmit = async (event) => {
    event.preventDefault()

    setAlert(false)

    if(!username && !password){
      return
    }

    if (password !== rePassword) {
      setAlert(true)
      return
  }
    

    await authenticateUpdate(`/api/user/${id}`, 'PUT', {
      username,
      password
    }, (user) => {
      userContext.logIn(user)
    }, (e) => {
      console.log("Error", e);
    })
    getData()
  }

  useEffect(() => {
    getData()
  }, [getData])

  if (!userName) {
    return (
      <PageLayout>
        <Loader
          type="TailSpin"
          color="#363338"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      </PageLayout>
    )
  }

  const goToTeamPage = (teamId) => {
    history.push(`/team/${teamId}`)
  }

  return (
    <PageLayout>


      <Title title='Profile' />

      <div className={styles.container}>

        <div className={styles.leftButtons}>

          <div>
            <button className={styles.navigateButtons}
              onClick={() => { setUserNameActive(!userNameActive) }}
            >Username:</button>
          </div>

          <div>
            <button className={styles.navigateButtons}
              onClick={() => { setPaswordActive(!passwordActive) }}
            >Change Password</button>
          </div>

          <div>
            <button className={styles.navigateButtons}
              onClick={() => { setPaswordActive(!passwordActive) }}
            >Confirm Password</button>
          </div>

          <div>
            <button className={styles.navigateButtons}
            // onClick={}`)}
            >Email:</button>
          </div>

          <div>
            <button className={styles.navigateButtons}
              onClick={() => history.push(`/my-tasks/${id}`)}
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
                          <div>
                            <button key={index}
                              // className={styles.teamNames}
                              className={styles.navigateButtons}
                              onClick={() => goToTeamPage(t._id)}
                            >{t.name}</button>

                          </div>
                        )
                      }
                      )
                    }
                  </div>
                  : null

              }
            </div>
          </div>



        </div>


        <span className={styles.middleButtons}>

        
          <div>
            < input
              // onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              onChange={e => setUsername(e.target.value)}
              className={styles.inputFieldsProfile}
              placeholder={userName}
              disabled={userNameActive}
            />

          </div>

          <div>
            < input
              // onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              onChange={e => setPassword(e.target.value)}
              className={styles.inputFieldsProfile}
              placeholder={'********'}
              disabled={passwordActive}
              type="password"
            />
          </div>

          <div className={styles.alerts}>
                <Alert alert={alert} message={'Passwords do not match'} />                
            </div>

          <div>
            < input
              // onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              onChange={e => setRePassword(e.target.value)}
              className={styles.inputFieldsProfile}
              placeholder={'********'}
              disabled={passwordActive}
              type="password"
            />
          </div>

          <div>
            < input
              // onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              className={styles.inputFieldsProfile}
              placeholder={userEmail}
              disabled={true}
            // type="password"
            />
          </div>


          <div className={styles.buttonDivSave}>
            <button type='submit' className={styles.saveButton} onClick={(e)=>handleSubmit(e)}>Save</button>
          </div>
        </span>


        <span className={styles.picContainer}>


          <div className={styles.profilePicContainer}>
            <div className={styles.profilePic}>
              <p className={styles.loadPicText}>Load a profile picture</p>
              <img className={styles.pen} src={pen} alt="" />

            </div>

            <p>{userName}</p>
          </div>


          <div>
            <img className={styles.pic1} src={pic1} alt="" width="80%" height="80%" />
          </div>
        </span>

      </div>


    </PageLayout>
  )
}

export default ProfilePage;
import React, { useState, useEffect, useCallback, useContext, useRef } from "react"
import Loader from "react-loader-spinner"
import { useParams, useHistory } from "react-router-dom"
import PageLayout from "../../components/page-layout"
import styles from './index.module.css'
import pic1 from '../../images/profile-page-pic.svg'
import pen from '../../images/pen.svg'
import authenticateUpdate from '../../utils/authenticate-update';
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import Title from "../../components/title"
import UserContext from "../../contexts/UserContext"
import Alert from "../../components/alert"


const ProfilePage = () => {
  const dropdownRef = useRef(null)
  const userContext = useContext(UserContext)
  const [userEmail, setUserEmail] = useState(null)
  const [passwordActive, setPaswordActive] = useState(true)
  const [userNameActive, setUserNameActive] = useState(true)
  const [username, setUsername] = useState(userContext.user.username);
  const [password, setPassword] = useState(null);
  const [rePassword, setRePassword] = useState(null);
  const [alert, setAlert] = useState(false)
  const [showTeamsVisibleForm, setShowTeamsVisibleForm] = useDetectOutsideClick(dropdownRef)




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
    setPaswordActive(!passwordActive)


    if (!username && !password) {
      return
    }

    if (password !== rePassword) {
      setAlert(true)
      return
    }

    // if(password && rePassword){
    //   setChangePassAlert(true)
    // }

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

        <div className={styles.leftContainer}>

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
              >Email:</button>
            </div>

            <div>
              <button className={styles.navigateButtons}
                onClick={() => history.push(`/my-tasks/${id}`)}
              >My Tasks</button>
            </div>

            <div>
              <div className={styles.myTeamsContainer}>
                < button onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)}
                  className={styles.myTeamButton}
                >My Teams</ button>
                <div className={styles.selectTeamContainer}>
                  {
                    showTeamsVisibleForm ?
                      <div className={styles.teamsHome} ref={dropdownRef}>
                        {
                          userTeams.map((t, index) => {
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
                        }
                      </div>
                      : null
                  }
                </div>
              </div>
            </div>



          </div>


          <div className={styles.middleButtons}>


            <div>
              < input
                // onClick={() => setShowTeamForm(true)}
                // title='Create Team' 
                // className={styles.teamNames}
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={styles.inputFieldsProfile}
                placeholder={userName}
                disabled={userNameActive}
              />

            </div>

            <div>
              < input
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

            {!passwordActive ?
              <div className={styles.newPassAlert}>
                Important!!! You have to activate your new password by following the link sent to your email. You have to do this in the next hour in order for your new password to be activated
            </div> : null
            }
            <div>
              < input
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
                value={userEmail}
                disabled={true}
              // type="password"
              />
            </div>


            <div className={styles.buttonDivSave}>
              <button type='submit' className={styles.saveButton} onClick={(e) => handleSubmit(e)}>Save</button>
            </div>
          </div>

        </div>




        <div className={styles.picContainer}>


          <div className={styles.profilePicContainer}>
            <div className={styles.profilePic}>
              <p className={styles.loadPicText}>Load a profile picture</p>
              <img className={styles.pen} src={pen} alt="" />

            </div>

            <p>{userName}</p>
          </div>



          <img className={styles.pic1} src={pic1} alt=""
          // width="80%" height="80%"
          />

        </div>

      </div>


    </PageLayout>
  )
}

export default ProfilePage;
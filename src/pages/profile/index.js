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
import ButtonGrey from '../../components/button-grey'
import ConfirmDialog from "../../components/confirmation-dialog"



const ProfilePage = () => {
  const dropdownRef = useRef(null)
  const userContext = useContext(UserContext)
  const [userEmail, setUserEmail] = useState(null)
  const [passwordActive, setPaswordActive] = useState(false)
  const [userNameActive, setUserNameActive] = useState(false)
  const [username, setUsername] = useState(userContext.user.username);
  const [password, setPassword] = useState(null);
  const [rePassword, setRePassword] = useState(null);
  const [alert, setAlert] = useState(false)
  const [showTeamsVisibleForm, setShowTeamsVisibleForm] = useDetectOutsideClick(dropdownRef)
  const [isEditListActive, setIsEditListActive] = useDetectOutsideClick(dropdownRef)
  const [confirmOpen, setConfirmOpen] = useState(false)



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
    setPaswordActive(false)
    setUserNameActive(false)



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

  const getFullImageUrl = (imagePath) => {
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/${imagePath}`
  }

  const widget = window.cloudinary.createUploadWidget({
    cloudName: process.env.REACT_APP_CLOUD_NAME,
    uploadPreset: process.env.REACT_APP_UPLOAD_PRESET
  }, (error, result) => {
    if (result.event === 'success') {
      const imagePath = result.info.path

      authenticateUpdate(`/api/user/${id}`, 'PUT', {
        imageUrl: imagePath
      }, (user) => {
        userContext.logIn(user)
      }, (e) => {
        console.log("Error", e);
      })
      getData()

      // socket.emit('update-profile-data', { picture: imagePath }, newData => {
      //     dispatchUserData({
      //         type: 'update-profile-data',
      //         payload: {
      //             newData
      //         }
      //     })
      // })
    }

    if (error) {
      //TODO: Handle errors

      return
    }
  })

  const deletePic = async () => {
    await authenticateUpdate(`/api/user/${id}`, 'PUT', {
      imageUrl: 'delete'
    }, (user) => {
      userContext.logIn(user)
    }, (e) => {
      console.log("Error", e);
    })
    getData()
  }



  return (
    <PageLayout>

      {confirmOpen &&
        <ConfirmDialog
          title={'you wish to delete this picture'}
          hideConfirm={() => setConfirmOpen(false)}
          onConfirm={() => deletePic()}
        />
      }


      <Title title='Profile' />

      <div className={styles.container}>

        <div className={styles.leftContainer}>



          <div className={styles.buttonInputDiv}>
            {/* <button className={styles.navigateButtons}
              onClick={() => { setUserNameActive(!userNameActive) }}
            >Username:</button> */}
            <ButtonGrey title={'Username:'} className={styles.navigateButtons}
              onClick={() => { setUserNameActive(!userNameActive) }} />
            < input
              // onClick={() => setShowTeamForm(true)}
              // title='Create Team' 
              // className={styles.teamNames}
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.inputFieldsProfile}
              placeholder={userName}
              disabled={!userNameActive}
            />


          </div>

          <div className={styles.buttonInputDiv}>
            {/* <button className={styles.navigateButtons}
              onClick={() => { setPaswordActive(!passwordActive) }}
            >Change Password</button> */}
            <ButtonGrey title={'Change Password'} className={styles.navigateButtons}
              onClick={() => { setPaswordActive(!passwordActive) }} />

            < input
              onChange={e => setPassword(e.target.value)}
              className={styles.inputFieldsProfile}
              placeholder={'********'}
              disabled={!passwordActive}
              type="password"
            />
          </div>


          <div className={styles.alerts}>
            <Alert alert={alert} message={'Passwords do not match'} />
          </div>

          {passwordActive ?
            <div className={styles.newPassAlert}>
              Important!!! You have to activate your new password by following the link sent to your email. You have to do this in the next hour in order for your new password to be activated
            </div> : null
          }

          <div className={styles.buttonInputDiv}>
            {/* <button className={styles.navigateButtons}
              onClick={() => { setPaswordActive(!passwordActive) }}
            >Confirm Password</button> */}
            <ButtonGrey title={'Confirm Password'} className={styles.navigateButtons}
              onClick={() => { setPaswordActive(!passwordActive) }} />

            < input
              onChange={e => setRePassword(e.target.value)}
              className={styles.inputFieldsProfile}
              placeholder={'********'}
              disabled={!passwordActive}
              type="password"
            />

          </div>

          <div className={styles.buttonInputDiv}>
            {/* <button className={styles.navigateButtons}
            >Email:</button> */}
            <ButtonGrey title={'Email:'} className={styles.navigateButtons}
            />

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

          <div className={styles.buttonInputDiv}>
            {/* <button className={styles.navigateButtons}
              onClick={() => history.push(`/my-tasks/${id}`)}
            >My Tasks</button> */}
            <ButtonGrey title={'My Tasks'} className={styles.navigateButtons}
              onClick={() => history.push(`/my-tasks/${id}`)} />
          </div>

          <div className={styles.buttonInputDiv}>
            <div className={styles.myTeamsContainer}>
              {/* < button onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)}
                className={styles.myTeamButton}
              >My Teams</ button> */}
              <ButtonGrey title={'My Teams'} className={styles.navigateButtons}
                onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)} />
              <div className={styles.selectTeamContainer}>
                {
                  showTeamsVisibleForm ?
                    <div className={styles.teamsHome} ref={dropdownRef}>
                      {userTeams.length > 0 ?
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
                        : "You haven't joined any teams yet"
                      }
                    </div>
                    : null
                }
              </div>
            </div>
            <div className={styles.buttonDivSave}>
              <button type='submit' className={styles.saveButton} onClick={(e) => handleSubmit(e)}>SAVE</button>
            </div>
          </div>
        </div>


        <div className={styles.picContainer}>


          <div className={styles.profilePicContainer}>
            <div className={styles.profilePic}
              onClick={() => {
                userContext.user.imageUrl ?
                setIsEditListActive(!isEditListActive)
                : widget.open()
              }}
            >
              {userContext.user.imageUrl ?
                <div className={styles['profile-picture']}>
                  <img
                    src={getFullImageUrl(userContext.user.imageUrl)}
                    className={styles['profile-picture']} alt=''
                  />
                  <div className={styles.relative}>
                    {isEditListActive && <div ref={dropdownRef} className={`${styles.menu}`} >
                      <ButtonGrey
                        onClick={() => widget.open()}
                        title='Edit'
                        className={styles.edit}
                      />
                      <ButtonGrey
                        onClick={() => {
                          setConfirmOpen(true)
                        }}
                        title='Delete'
                        className={styles.delete}
                      />
                    </div>}
                  </div>
                </div>
                :
                <div>
                  <p className={styles.loadPicText}>Load a profile picture</p>
                  <img className={styles.pen}
                    src={pen} alt="" />
                </div>
              }

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
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
import { Image, Transformation } from 'cloudinary-react';


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

  // const getFullImageUrl = (imagePath) => {
  //   return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/${imagePath}`
  // }

  const widget = window.cloudinary.createUploadWidget({
    cloudName: process.env.REACT_APP_CLOUD_NAME,
    uploadPreset: process.env.REACT_APP_UPLOAD_PRESET
  }, (error, result) => {
    if (result.event === 'success') {
      const path = result.info.path
      const publicId = result.info.public_id
      const newImage = {
        path,
        publicId
      }
      authenticateUpdate(`/api/user/image/${id}`, 'PUT', {
        newImage,
        oldImage: userContext.user.image
      }, (user) => {
        userContext.logIn(user)
      }, (e) => {
        console.log("Error", e);
      })
      getData()

    }

    if (error) {
      //TODO: Handle errors

      return
    }
  })

  const deletePic = async () => {

    await authenticateUpdate(`/api/user/image/${id}`, 'PUT', {
      oldImage: userContext.user.image
    }, (user) => {
      userContext.logIn(user)
    }, (e) => {
      console.log("Error", e);
    })
    getData()
  }

  console.log(userContext.user.image);
  // console.log(cloudinary);

  return (
    <PageLayout>

      {confirmOpen &&
        <ConfirmDialog
          title={'delete this picture'}
          hideConfirm={() => setConfirmOpen(false)}
          onConfirm={() => deletePic()}
        />
      }


      <Title title='Profile' />

      <div className={styles.container}>

        <div className={styles['left-container']}>



          <div className={styles['button-input-div']}>
            <ButtonGrey title={'Username:'} className={styles['navigate-buttons']}
              onClick={() => { setUserNameActive(!userNameActive) }} />
            < input
              ref={function (input) {
                if (input != null) {
                  input.focus();
                }
              }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles['input-fields-profile']}
              placeholder={userName}
              disabled={!userNameActive}
            />


          </div>

          <div className={styles['button-input-div']}>
            <ButtonGrey title={'Change Password'} className={styles['navigate-buttons']}
              onClick={() => { setPaswordActive(!passwordActive) }} />
            < input
              onChange={e => setPassword(e.target.value)}
              className={styles['input-fields-profile']}
              placeholder={'********'}
              disabled={!passwordActive}
              type="password"
            />
          </div>


          <div className={styles.alerts}>
            <Alert alert={alert} message={'Passwords do not match'} />
          </div>

          {passwordActive ?
            <div className={styles['new-pass-alert']}>
              Important!!! You have to activate your new password by following the link sent to your email. You have to do this in the next hour in order for your new password to be activated
            </div> : null
          }

          <div className={styles['button-input-div']}>
            <ButtonGrey title={'Confirm Password'} className={styles['navigate-buttons']}
              onClick={() => { setPaswordActive(!passwordActive) }} />

            < input
              onChange={e => setRePassword(e.target.value)}
              className={styles['input-fields-profile']}
              placeholder={'********'}
              disabled={!passwordActive}
              type="password"
            />

          </div>

          <div className={styles['button-input-div']}>

            <ButtonGrey title={'Email:'} className={styles['navigate-buttons']}
            />

            < input
              className={styles['input-fields-profile']}
              value={userEmail}
              disabled={true}
            // type="password"
            />

          </div>

          <div className={styles['button-input-div']}>
            <ButtonGrey title={'My Tasks'} className={styles['navigate-buttons']}
              onClick={() => history.push(`/my-tasks/${id}`)} />
          </div>

          <div className={styles['button-input-div']}>
            <div className={styles.myTeamsContainer}>

              <ButtonGrey title={'My Teams'} className={styles['navigate-buttons']}
                onClick={() => setShowTeamsVisibleForm(!showTeamsVisibleForm)} />
              <div className={styles['select-team-container']}>
                {
                  showTeamsVisibleForm ?
                    <div className={styles['teams-home']} ref={dropdownRef}>
                      {userTeams.length > 0 ?
                        userTeams.map((t, index) => {
                          return (
                            <span key={index}>
                              <div
                                className={styles['navigate-buttons-teams']}
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
            <div className={styles['button-div-save']}>
              <button type='submit' className={styles['save-button']} onClick={(e) => handleSubmit(e)}>SAVE</button>
            </div>
          </div>
        </div>


        <div className={styles['pic-container']}>


          <div className={styles['profile-pic-container']}>
            <div className={styles['profile-pic']}
              onClick={() => {
                userContext.user.image ?
                  setIsEditListActive(!isEditListActive)
                  : widget.open()
              }}
            >
              {userContext.user.image ?

                <div className={styles['profile-picture']}>
                  {/* <img
                    src={getFullImageUrl(userContext.user.image.path)}
                    className={styles['profile-picture']} alt=''
                  /> */}
                  <Image publicId={userContext.user.image.publicId} className={styles['profile-picture']} >
                    <Transformation width="250" height="250"
                    //  gravity="faces" crop="fill"
                    />
                  </Image>


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
                  <p className={styles['load-pic-text']}>Load a profile picture</p>
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
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import UserContext from '../../contexts/UserContext'
import styles from './index.module.css'
import Alert from '../Alert'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import useUserServices from '../../services/useUserServices'
import ButtonGrey from '../ButtonGrey'
import MyTeamsMenu from '../MyTeamsMenu'
import ProfilePageInputs from '../Inputs/ProfilePageInputs'

const UpdateUserData = ({ user, userEmail, getData }) => {
    const { logIn } = useContext(UserContext)
    const history = useHistory()
    const [isPasswordActive, setIsPaswordActive] = useState(false)
    const [isUserNameActive, setIsUserNameActive] = useState(false)
    const [username, setUsername] = useState(user.username)
    const [password, setPassword] = useState(null)
    const [rePassword, setRePassword] = useState(null)
    const [isAlertOn, setIsAlertOn] = useState(false)
    const [areUserTeamsShown, setAreUserTeamsShown, teamRef] = useDetectOutsideClick()
    const { updateUser, updateUserPassword } = useUserServices()
    const userTeams = user.teams
    const userId = user.id


    const goToTeamPage = (teamId) => {
        history.push(`/team/${teamId}`)
    }

    const handleUpdateUser = async (event) => {
        event.preventDefault()

        setIsAlertOn(false)
        setIsPaswordActive(false)
        setIsUserNameActive(false)

        if (!username && !password) {
            return
        }

        if (password !== rePassword) {
            setIsAlertOn(true)
            return
        }

        if (username) {
            const user = await updateUser(userId, username)
            logIn(user)
        }

        if (password) {
            const user = await updateUserPassword(userId, password)
            logIn(user)
            return
        }
        
        getData()
    }


    return (
        <div className={styles['inputs-container']}>
            <ProfilePageInputs
                title={'Username:'}
                onClick={() => { setIsUserNameActive(!isUserNameActive) }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={styles['input-fields-profile']}
                placeholder={username}
                disabled={!isUserNameActive}
            />
            <ProfilePageInputs
                title={'Change Password'}
                onClick={() => { setIsPaswordActive(!isPasswordActive) }}
                onChange={e => setPassword(e.target.value)}
                className={styles['input-fields-profile']}
                placeholder={'********'}
                disabled={!isPasswordActive}
                type='password'
            />
            <div className={styles.alerts}>
                <Alert alert={isAlertOn} message={'Passwords do not match'} />
            </div>
            {
                isPasswordActive &&
                <div className={styles['new-pass-alert']}>
                    Important!!! You have to activate your new password by following the link sent to your email. You have to do this in the next hour in order for your new password to be activated
                </div>
            }
            <ProfilePageInputs
                title={'Confirm Password'}
                onClick={() => { setIsPaswordActive(!isPasswordActive) }}
                onChange={e => setRePassword(e.target.value)}
                className={styles['input-fields-profile']}
                placeholder={'********'}
                disabled={!isPasswordActive}
                type='password'
            />

            <ProfilePageInputs
                title={'Email:'}
                className={styles['input-fields-profile']}
                value={userEmail}
                disabled={true}
            />

            <ProfilePageInputs
                classNameDiv={styles['button-input-div-tasks']}
                title={'My Tasks'}
                onClick={() => history.push(`/my-tasks/${userId}`)}
                className={styles['input-fields-tasks']}
                value={''}
                disabled={true}
            />

            <div className={styles['button-input-div']}>
                <div className={styles.myTeamsContainer}>
                    <ButtonGrey
                        title={'My Teams'}
                        className={styles['navigate-buttons']}
                        onClick={() => setAreUserTeamsShown(!areUserTeamsShown)}
                    />
                    <div className={styles['select-team-container']} ref={teamRef}>
                        {
                            areUserTeamsShown &&
                            <MyTeamsMenu userTeams={userTeams} goToTeamPage={goToTeamPage} />
                        }
                    </div>
                </div>

                <div className={styles['button-div-save']}>
                    <ButtonGrey
                        title={'SAVE'}
                        className={styles['save-button']}
                        onClick={(e) => handleUpdateUser(e)}
                    />
                </div>
            </div>
        </div>
    )
}

export default UpdateUserData
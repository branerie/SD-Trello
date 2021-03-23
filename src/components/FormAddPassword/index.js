import React, { useCallback, useContext, useState } from 'react'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import { useHistory } from 'react-router-dom'
import Alert from '../Alert'
import UserContext from '../../contexts/UserContext'
import useUserServices from '../../services/useUserServices'

export default function AddPassword({ userId }) {
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [alert, setAlert] = useState(false)
    const [fillAlert, setFillAlert] = useState(false)
    const { addNewPassword } = useUserServices()


    const userContext = useContext(UserContext)


    const history = useHistory()

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()

        setAlert(false)
        setFillAlert(false)


        if (!password || !rePassword) {
            setFillAlert(true)
            return
        }

        if (password !== rePassword) {
            setAlert(true)
            return
        }

        const response = await addNewPassword(userId, password)
        userContext.logIn(response.user)
        history.push('/')
                

    }, [history, userContext, password, rePassword, userId, addNewPassword])

    return (

        <form className={styles.container} >

            <div className={styles['inner-container']}>

                <div className={styles.logo}>
                    <img src={logo} alt='logo' width='110' height='100' />
                </div>

                <div className={styles['right-side']}>
                    <div className={styles.alerts}>
                        <Alert alert={alert} message={'Passwords do not match'} />
                        <Alert alert={fillAlert} message={'Please fill all fileds'} />
                    </div>

                    <div className={styles.title} >Add password to user</div>

                    <div className={styles['input-container']}>
                        <div> Password:</div>
                        <input
                            placeholder='********'
                            className={styles['pass-input']}
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            label='New Password'
                            id='password'
                        />

                        <div className={styles['pass-instructions']}>
                            <p>Use 8 or more characters with a mix </p>
                            <p>of letters, numbers & symbols. </p>
                        </div>
                    </div>

                    <div className={styles['input-container']}>
                        <div> Confirm Password:</div>
                        <input
                            placeholder='********'
                            className={styles['pass-input']}
                            type='password'
                            value={rePassword}
                            onChange={e => setRePassword(e.target.value)}
                            label='Confirm Password'
                            id='rePassword'
                        />

                    </div>

                    <div className={styles['new-pass-alert']}>
                        Important!!! You have to activate your new password by following the link sent to your email. You have to do this in the next hour in order for your new password to be activated
                    </div>

                    <div className={styles['button-div-login']}>
                        <button type='submit' className={styles['login-button']} onClick={handleSubmit}>Submit</button>
                    </div>

                    <div className={styles['text-login']}>User was registered with Google. Please add password for this Website</div>
                </div>

            </div>
        </form>
    )
}

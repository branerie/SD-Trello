import React, { useState, useContext } from 'react'
import GoogleLogin from 'react-google-login'
import { useHistory } from 'react-router-dom'
import styles from './index.module.css'
import UserContext from '../../contexts/UserContext'
import logo from '../../images/logo.svg'
import google from '../../images/welcome-page/google.svg'
import Alert from '../Alert'
import useUserServices from '../../services/useUserServices'

const ForgotPasswordForm = (props) => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [rePassword, setRePassword] = useState('')
    const context = useContext(UserContext)
    const history = useHistory()
    const [fillAlert, setFillAlert] = useState(false)
    const [wrongPassAllert, setWrongPassAllert] = useState(false)
    const [wrongUserAllert, setWrongUserAllert] = useState(false)
    const { userLogin, addNewPassword, googleLoginUser } = useUserServices()

    const handleSubmit = async (event) => {
        event.preventDefault()

        setFillAlert(false)
        setWrongPassAllert(false)
        setWrongUserAllert(false)

        if (!password || !email) {
            setFillAlert(true)
            return
        }
        
        if (password !== rePassword) {
            setWrongPassAllert(true)
            return
        }

        const response = await userLogin(email, password)

        if (response.wrongUser) {
            setWrongUserAllert(true)
            return
        }

        let userId
        console.log('Error', response)
        if (response.id) {
            userId = response.id
        }

        if (response.userId) {
            userId = response.userId
        }

        const changePassResponse = await addNewPassword(userId, password)
        context.logIn(changePassResponse.user)
        history.push('/')

    }

    const handleGoogle = async (googleResponse) => {
        const { tokenId } = googleResponse
        const user = await googleLoginUser(tokenId)
        context.logIn(user)
        history.push('/')
    }

    return (
        <div>

            <form className={styles.container} onSubmit={handleSubmit}>

                <div className={styles['inner-container']}>
                    <div className={styles.logo}>
                        <img src={logo} alt='logo' width='110' height='100' />
                    </div>

                    <div className={styles['right-side']}>
                        <div className={styles.alerts}>
                            <Alert alert={fillAlert} message={'Please fill all fileds'} />
                            <Alert alert={wrongPassAllert} message={'Passwords do not match'} />
                            <Alert alert={wrongUserAllert} message={'Please fill valid email address'} />
                        </div>

                        <div className={styles.title} >Forgot Password Form</div>


                        <div className={styles['input-container']}>
                            <div> Email:</div>
                            <input
                                className={styles.emailInput}
                                placeholder='John@example.com'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                label='Email'
                                id='email'
                            />
                        </div>

                        <div className={styles['input-container']}>
                            <div>New Password:</div>
                            <input
                                className={styles.passInput}
                                placeholder='********'
                                type='password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                label='Password'
                                id='password'
                            />
                        </div>

                        <div className={styles['input-container']}>
                            <div>Re-type New Password:</div>
                            <input
                                className={styles.passInput}
                                placeholder='********'
                                type='password'
                                value={rePassword}
                                onChange={e => setRePassword(e.target.value)}
                                label='Confirm Password'
                                id='rePassword'
                            />
                        </div>

                        <div className={styles.buttonDivLogin}>
                            <button type='submit' className={styles.loginButton}>Submit</button>
                        </div>


                        <div className={styles.textDiv}>

                            <p className={styles.newToSmM}>
                                New to Smart Manager?
                                <button className={styles.signUpBtn}
                                    onClick={() => { props.goToSignUp(); props.hideForm() }}
                                >Sign Up</button>
                            </p>
                            <h3>
                                or
                            </h3>
                        </div>


                        <div className={styles.buttonDivGoogleLogin}>
                            <GoogleLogin
                                render={renderProps => (
                                    <button onClick={renderProps.onClick}
                                        className={styles.googleLoginBtn}
                                    >
                                        <img src={google} alt='logo' width='25' height='25' />
                                    Log In with Google</button>
                                )}
                                clientId='737157840044-8cdut4c3o2lrn6q2jn37uh65ate0g7pr.apps.googleusercontent.com'
                                buttonText='Login'
                                onSuccess={handleGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ForgotPasswordForm
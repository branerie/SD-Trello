import React, { useContext, useState, useEffect } from 'react'
import GoogleLogin from 'react-google-login'
import { useHistory } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import authenticateUpdate from '../../utils/authenticate-update'
import responseGoogle from '../../utils/responseGoogle'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import google from '../../images/welcome-page/google.svg'



export default function AddPassword(props) {
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [disabled, setDisabled] = useState(true)
    const context = useContext(UserContext)
    const history = useHistory()

    const handleGoogle = async (googleResponse) => {
        let userId
        await responseGoogle(googleResponse, (user) => {
            userId = user.id
            context.logIn(user)
            history.push("/")
        }, (response) => {
            console.log("Error", response)
        })
        await authenticateUpdate(`/api/user/${userId}`, 'PUT', {
            password
        }, (user) => {
            context.logIn(user)
        }, (e) => {
            console.log("Error", e)
        })
        props.hideForm()
    }

    useEffect(() => {
        if (password && password === rePassword) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [password, rePassword])

    return (

        <form className={styles.container} >

            <div className={styles.logo}>
                <img src={logo} alt="logo" width='110' height='100' />
            </div>

            <div className={styles.rightSide}>

                <div className={styles.title} >Add password to user</div>

                <div className={styles.inputContainer}>
                    <div> Password:</div>
                    <input
                    placeholder='********'
                        className={styles.input}
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        label="New Password"
                        id="password"
                    />
                     <div className={styles.passInstructions}>
                        <p>Use 8 or more characters with a mix </p>
                        <p>of letters, numbers & symbols. </p>
                    </div>
                </div>

                <div className={styles.inputContainer}>
                    <div> Confirm Password:</div>
                    <input
                    placeholder='********'
                        className={styles.input}
                        type="password"
                        value={rePassword}
                        onChange={e => setRePassword(e.target.value)}
                        label="Confirm Password"
                        id="rePassword"
                    />
                </div>


                <GoogleLogin
                    render={renderProps => (
                        <button onClick={renderProps.onClick}
                            className={styles.googleLoginBtn}
                        >
                            <img src={google} alt="logo" width='25' height='25' />
                            Submit</button>
                    )}
                    disabled={disabled}
                    clientId='737157840044-8cdut4c3o2lrn6q2jn37uh65ate0g7pr.apps.googleusercontent.com'
                    buttonText="Submit"
                    onSuccess={handleGoogle}
                    // onFailure={errorGoogle}
                    cookiePolicy={'single_host_origin'}
                />
                <div>User was registered with Google. Please add password for this Website</div>
            </div>
        </form>
    )
}

import React, { useState, useContext } from "react"
import GoogleLogin from 'react-google-login'
import { useHistory } from "react-router-dom"
import styles from "./index.module.css"
import authenticate from "../../utils/authenticate"
import UserContext from "../../contexts/UserContext"
import responseGoogle from "../../utils/responseGoogle"
import Transparent from "../transparent"
import AddPassword from "../form-add-password"
import logo from '../../images/logo.svg'
import google from '../../images/welcome-page/google.svg'
import Alert from "../alert"



const LoginForm = (props) => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [userId, setUserId] = useState('')
    const context = useContext(UserContext)
    const history = useHistory()
    const [fillAlert, setFillAlert] = useState(false)
    const [wrongPassAllert, setWrongPassAllert] = useState(false)
    const [wrongUserAllert, setWrongUserAllert] = useState(false)




    const handleSubmit = async (event) => {
        event.preventDefault();
        
        setFillAlert(false)
        setWrongPassAllert(false)
        setWrongUserAllert(false)

        if (!password || !email) {
            setFillAlert(true)
            return
        }

        await authenticate("/api/user/login", 'POST', {
            email,
            password
        }, (user) => {            
            context.logIn(user)
            history.push("/")
        }, (response) => {
            if (response.needPassword) {
                setUserId(response.userId)
                setShowForm(true)
            }
            if (response.wrongPassword) {
                setWrongPassAllert(true)
            }
            if (response.wrongUser) {
                setWrongUserAllert(true)
            }
            console.log("Error", response)
        })
    }

    const handleGoogle = (googleResponse) => {
        responseGoogle(googleResponse, (user) => {            
            context.logIn(user)
            history.push("/")
        }, (response) => {
            console.log("Error", response)
        })
    }

    const hideForm = () => {
        setShowForm(false)
    }

    return (
        <div>

            {
                showForm ?
                    <div>
                        <Transparent hideForm={hideForm}>
                            <AddPassword hideForm={hideForm} userId={userId} email={email}/>
                        </Transparent>
                    </div> : null
            }
            <form className={styles.container} onSubmit={handleSubmit}>
                <div className={styles.alerts}>
                    <Alert alert={fillAlert} message={'Please fill all fileds'} />
                    <Alert alert={wrongPassAllert} message={'Wrong Password'} />
                    <Alert alert={wrongUserAllert} message={'Please fill valid email address'} />
                </div>

                <div className={styles.innerContainer}>
                    <div className={styles.logo}>
                        <img src={logo} alt="logo" width='110' height='100' />
                    </div>

                    <div className={styles.rightSide}>

                        <div className={styles.title} >Log In with E-mail</div>


                        <div className={styles.inputContainer}>
                            <div> Email:</div>
                            <input
                                className={styles.emailInput}
                                placeholder='John@example.com'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                label="Email"
                                id="email"
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <div> Password:</div>
                            <input
                                className={styles.passInput}
                                placeholder='********'
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                label="Password"
                                id="password"
                            />
                        </div>

                        <div className={styles.buttonDivLogin}>
                            <button type='submit' className={styles.loginButton}>Log In</button>
                        </div>


                        <div className={styles.textDiv}>
                            <p className={styles.forgotPass}>
                                Forgot Password?
                        </p>
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
                                        <img src={google} alt="logo" width='25' height='25' />
                                    Log In with Google</button>
                                )}
                                clientId='737157840044-8cdut4c3o2lrn6q2jn37uh65ate0g7pr.apps.googleusercontent.com'
                                buttonText="Login"
                                onSuccess={handleGoogle}
                                // onFailure={errorGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;
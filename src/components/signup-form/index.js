import React, { useContext, useState } from "react"
import GoogleLogin from 'react-google-login'
import styles from "./index.module.css"
import authenticate from "../../utils/authenticate"
import UserContext from "../../contexts/UserContext"
import { useHistory } from "react-router-dom"
import Alert from "../alert"
import responseGoogle from "../../utils/responseGoogle"
import logo from '../../images/logo.svg'
import google from '../../images/welcome-page/google.svg'



const SignupForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [alert, setAlert] = useState(false)
    const [fillAlert, setFillAlert] = useState(false)
    const [userExist, setUserExist] = useState(false)
    const [validEmailAlert, setValidEmailAlert] = useState(false)
    const context = useContext(UserContext)
    const history = useHistory()


    function validateEmail(email) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return re.test(email);
    }


    const handleSubmit = async (event) => {
        event.preventDefault()



        setValidEmailAlert(false)
        setAlert(false)
        setFillAlert(false)
        setUserExist(false)

        const valid = validateEmail(email)
        
        if (!valid) {
            setValidEmailAlert(true)
            return
        }

        if (password !== rePassword) {
            setAlert(true)
            return
        }


        if (!username || !password || !rePassword || !email) {
            setFillAlert(true)
            return
        }

        await authenticate("/api/user/register", 'POST', {
            email,
            username,
            password
        }, (user) => {
            context.logIn(user);
            history.push("/");
        }, (response) => {
            if (response.exist) {
                setUserExist(true)
            }
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

    return (


        <form className={styles.container} onSubmit={handleSubmit}>



            <div className={styles.innerContainer}>
                <div className={styles.logo}>
                    <img src={logo} alt="logo" width='110' height='100' />
                </div>

                <div className={styles.rightSide}>

                    <div className={styles.alerts}>
                        <Alert alert={alert} message={'Passwords do not match'} />
                        <Alert alert={userExist} message={'User with this email already exists'} />
                        <Alert alert={fillAlert} message={'Please fill all fileds'} />
                        <Alert alert={validEmailAlert} message={'Please enter valid email address'} />
                    </div>
                    <div className={styles.title}  >Sign Up with E-mail</div>

                    <div className={styles.inputContainer}>
                        <div> Username:</div>
                        <input
                            placeholder='John Smith'
                            className={styles.signUpInput}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            label="Username"
                            id="username"
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <div> Email:</div>
                        <input
                            placeholder='John@example.com'
                            className={styles.signUpInput}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email"
                            id="email"
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <div> Password:</div>
                        <input
                            placeholder='********'
                            className={styles.signUpInput}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            id="password"
                        />
                        <div className={styles.passInstructions}>
                            <p>Use 8 or more characters with a</p>
                            <p>mix of letters, numbers & symbols. </p>
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <div> Re-type Password:</div>
                        <input
                            placeholder='********'
                            className={styles.signUpInput}
                            type="password"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            label="Re-Password"
                            id="re-password"
                        />
                    </div>

                    <div className={styles.buttonDivLogin}>
                        <button type='submit' className={styles.signUpButton}>Get Started</button>
                    </div>

                    <div className={styles.textDiv}>
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
                                    <img src={google} alt="logo" width='25' height='25' />Sign Up with Google</button>
                            )}
                            clientId='737157840044-8cdut4c3o2lrn6q2jn37uh65ate0g7pr.apps.googleusercontent.com'
                            buttonText="Sign up with Google"
                            onSuccess={handleGoogle}
                            // onFailure={errorGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>

                    <div className={styles.textDiv}>
                        <p className={styles.alreadySignUp}>
                            Already Sign Up?
                        <button className={styles.signUpBtn} onClick={() => { props.goToLogin(); props.hideForm() }}>Log In</button>
                        </p>

                    </div>
                </div>
            </div>
        </form>

    )

}

export default SignupForm;
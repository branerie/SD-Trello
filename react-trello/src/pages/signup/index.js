import React, { useContext, useState } from "react"
import GoogleLogin from 'react-google-login'
import Button from "../../components/button"
import Input from "../../components/input"
import Title from "../../components/title"
import styles from "./index.module.css"
import authenticate from "../../utils/authenticate"
import UserContext from "../../Context"
import { useHistory } from "react-router-dom"
import Alert from "../../components/alert"
import responseGoogle from "../../utils/responseGoogle"

const SignupPage = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [email, setEmail] = useState(null)
    const [rePassword, setRePassword] = useState(null)
    const [alert, setAlert] = useState(false)
    const [fillAlert, setFillAlert] = useState(false)
    const [userExist, setUserExist] = useState(false)
    const context = useContext(UserContext)
    const history = useHistory()

    const handleSubmit = async (event) => {
        event.preventDefault()

        setAlert(false)
        setFillAlert(false)
        setUserExist(false)

        if (password !== rePassword) {
            setAlert(true)
            return
        }

        
        if (!username || !password || !rePassword || !email) {
            setFillAlert(true)
            return
        }
        
        await authenticate("http://localhost:4000/api/user/register", 'POST', {
            email,
            username,
            password
        }, (user) => {
            context.logIn(user);
            history.push("/");
        }, (response) => {
            if(response.exist) {
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
        <div>
            <Alert alert={alert} message={'Passwords do not match'}/>
            <Alert alert={userExist} message={'User with this email already exists'}/>
            <Alert alert={fillAlert} message={'Please fill all fileds'}/>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Register" />
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    id="username"
                />
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    id="email"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    id="password"
                />
                <Input
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    label="Re-Password"
                    id="re-password"
                />

                <Button title="Register" />
            </form>
            <GoogleLogin
                    clientId='737157840044-8cdut4c3o2lrn6q2jn37uh65ate0g7pr.apps.googleusercontent.com'
                    buttonText="Sign up with Google"
                    onSuccess={handleGoogle}
                    // onFailure={errorGoogle}
                    cookiePolicy={'single_host_origin'}
                />
        </div>
    )

}

export default SignupPage;
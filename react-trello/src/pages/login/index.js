import React, { useState, useContext } from "react"
import GoogleLogin from 'react-google-login'
import { useHistory } from "react-router-dom"
import Button from "../../components/button"
import Input from "../../components/input"
import Title from "../../components/title"
import styles from "./index.module.css"
import authenticate from "../../utils/authenticate"
import UserContext from "../../contexts/UserContext"
import responseGoogle from "../../utils/responseGoogle"
import Transparent from "../../components/transparent"
import AddPassword from "../../components/form-add-password"

const LoginPage = () => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [showForm, setShowForm] = useState(false)
    const context = useContext(UserContext)
    const history = useHistory()

    const handleSubmit = async (event) => {
        event.preventDefault();

        await authenticate("http://localhost:4000/api/user/login", 'POST', {
            email,
            password
        }, (user) => {
            context.logIn(user)
            history.push("/")
        }, (response) => {
            if (response.needPassword) {
                setShowForm(true)
            }
            console.log("Error", response)
        })
    }

    const handleGoogle = (googleResponse) => {
        responseGoogle(googleResponse, (user) => {
            console.log(user);
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
                            <AddPassword hideForm={hideForm} />
                        </Transparent>
                    </div> : null
            }
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Login" />
                <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    label="Email"
                    id="email"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    label="Password"
                    id="password"
                />
                <Button title="Login" />
            </form>
            <GoogleLogin
                clientId='737157840044-8cdut4c3o2lrn6q2jn37uh65ate0g7pr.apps.googleusercontent.com'
                buttonText="Login"
                onSuccess={handleGoogle}
                // onFailure={errorGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default LoginPage;
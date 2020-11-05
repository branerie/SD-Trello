import React, { useState, useContext } from "react"
import GoogleLogin from 'react-google-login'
import { useHistory } from "react-router-dom"
import SubmitButton from "../../components/button/submit-button"
import Input from "../../components/input"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import styles from "./index.module.css"
import authenticate from "../../utils/authenticate"
import UserContext from "../../Context"

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const context = useContext(UserContext)
    const history = useHistory()

    const responseGoogle = async (response) => {
        const { email, name, imageUrl, googleId } = response.profileObj

        await authenticate("http://localhost:4000/api/user/login", 'POST', {
            email,
            username: name,
            imageUrl,
            googlePassword: googleId
        }, (user) => {
            context.logIn(user)
            history.push("/")
        }, (e) => {
            console.log("Error", e)
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await authenticate("http://localhost:4000/api/user/login", 'POST', {
            email,
            password
        }, (user) => {
            context.logIn(user)
            history.push("/")
        }, (e) => {
            console.log("Error", e)
        })
    };

    return (
        <PageLayout>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Login" />
                <Input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    label="Username"
                    id="username"
                />
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
                <SubmitButton title="Login" />
            </form>
                <GoogleLogin
                    clientId=''
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    // onFailure={errorGoogle}
                    cookiePolicy={'single_host_origin'}
                />
        </PageLayout>
    )
}

export default LoginPage;

import React, { useContext, useState, useEffect } from 'react'
import GoogleLogin from 'react-google-login'
import { useHistory, useParams } from 'react-router-dom'
import UserContext from '../../Context'
import authenticateUpdate from '../../utils/authenticate-update'
import responseGoogle from '../../utils/responseGoogle'
import Alert from '../alert'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'

export default function AddPassword(props) {
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [disabled, setDisabled] = useState(true)
    const context = useContext(UserContext)
    const history = useHistory()

    const handleGoogle = async (googleResponse) => {
        let userId
        const asd = await responseGoogle(googleResponse, (user) => {
            userId = user.id            
            context.logIn(user)
            history.push("/")
        }, (response) => {
            console.log("Error", response)
        })
        await authenticateUpdate(`http://localhost:4000/api/user/${userId}`, 'PUT', {
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
    }, [rePassword])

    return (
        <div className={styles.form}>
            <form className={styles.container} >
                <Title title="Add password to user" />
                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    label="New Password"
                    id="password"
                />
                <Input
                    type="password"
                    value={rePassword}
                    onChange={e => setRePassword(e.target.value)}
                    label="Confirm Password"
                    id="rePassword"
                />
                <GoogleLogin
                    disabled={disabled}
                    clientId='737157840044-8cdut4c3o2lrn6q2jn37uh65ate0g7pr.apps.googleusercontent.com'
                    buttonText="Submit"
                    onSuccess={handleGoogle}
                    // onFailure={errorGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </form>
            <div>User was registered with Google. Please add password for this Website</div>
        </div>
    )
}

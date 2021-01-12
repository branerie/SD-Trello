import React, { useCallback, useContext, useState } from 'react'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import { useHistory } from 'react-router-dom'
import Alert from '../alert'
import authenticateUpdate from '../../utils/authenticate-update'
import authenticate from "../../utils/authenticate"
import UserContext from "../../contexts/UserContext"



export default function AddPassword(props) {
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [alert, setAlert] = useState(false)
    const [fillAlert, setFillAlert] = useState(false)

    const userContext = useContext(UserContext)


    const history = useHistory()
    const userId = props.userId
    const email = props.email
    // const [disabled, setDisabled] = useState(true)

    // useEffect(() => {
    //     if (password && password === rePassword) {
    //         setDisabled(false)
    //     } else {
    //         setDisabled(true)
    //     }
    // }, [password, rePassword])


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

        await authenticateUpdate(`/api/user/${userId}`, 'PUT', {
            password
        }, (user) => {
            console.log(user)           
        }, (e) => {
            console.log("Error", e);
        })

        await authenticate("/api/user/login", 'POST', {
            email,
            password
        }, (user) => {
            userContext.logIn(user)
            history.push("/")
        }, (response) => {
            
            console.log("Error", response)
        })

    }, [history, userContext, password, rePassword, userId, email])



    return (

        <form className={styles.container} >

            <div className={styles.alerts}>
                <Alert alert={alert} message={'Passwords do not match'} />
                <Alert alert={fillAlert} message={'Please fill all fileds'} />
            </div>

            <div className={styles.innerContainer}>

                <div className={styles.logo}>
                    <img src={logo} alt="logo" width='110' height='100' />
                </div>

                <div className={styles.rightSide}>

                    <div className={styles.title} >Add password to user</div>

                    <div className={styles.inputContainer}>
                        <div> Password:</div>
                        <input
                            placeholder='********'
                            className={styles.passInput}
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
                            className={styles.passInput}
                            type="password"
                            value={rePassword}
                            onChange={e => setRePassword(e.target.value)}
                            label="Confirm Password"
                            id="rePassword"
                        />
                    </div>

                    <div className={styles.buttonDivLogin}>
                        <button type='submit' className={styles.loginButton} onClick={handleSubmit}>Submit</button>
                    </div>

                    <div className={styles.textLogin}>User was registered with Google. Please add password for this Website</div>
                </div>

            </div>
        </form>
    )
}

import React, { useState } from 'react'
import styles from './index.module.css'
import logo from '../../images/logo.svg'


export default function AddPassword(props) {
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    // const [disabled, setDisabled] = useState(true)

    // useEffect(() => {
    //     if (password && password === rePassword) {
    //         setDisabled(false)
    //     } else {
    //         setDisabled(true)
    //     }
    // }, [password, rePassword])

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
                    <button type='submit' className={styles.loginButton}>Submit</button>
                </div>

                <div className={styles.textLogin}>User was registered with Google. Please add password for this Website</div>
            </div>
        </form>
    )
}

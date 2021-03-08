import React, { useState, useEffect, useContext, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom"
import styles from './index.module.css'
import Button from "../../components/Button"
import UserContext from "../../contexts/UserContext"
import authenticate from "../../utils/authenticate"
import logo from '../../images/logo.svg'


const ConfirmationPage = () => {
    const params = useParams()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const userContext = useContext(UserContext)
    const firstRegistration = userContext.user.newPasswordConfirmed



    const confirmToken = useCallback(async () => {
        const token = params.token
        if (params.token === 'not-confirmed') {
            return
        }

        if (userContext.user.confirmed && userContext.user.newPasswordConfirmed) {
            return
        }

        await authenticate('/api/user/confirmation', 'POST', {
            token
        }, (user) => {
            userContext.logIn(user)
            setLoading(false)
            setSuccess(true)
        }, (response) => {
            console.log("Error", response)
        })

    }, [params.token, userContext])

    useEffect(() => {
        confirmToken()
    }, [confirmToken])


    if (params.token === 'not-confirmed') {
        return (
            <div>
                {
                    firstRegistration ?
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <img src={logo} alt="logo" width='194' height='142' />
                            </div>
                            <div className={styles.title}> Confirm your email address</div >
                            <div className={styles.text}>Please check your email to confirm your account</div>
                            <div className={styles.text}>Once confirmed, this email address will be uniquely associated with your Smart Manager  account.</div>
                            
                        </div>
                        :
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <img src={logo} alt="logo" width='194' height='142' />
                            </div>
                            <div className={styles.title}> Confirm your new password</div >
                            <div className={styles.text}>Please check your email to confirm your new password</div>
                            <div className={styles.text}>Once confirmed, your new password will be active for your Smart Manager  account.</div>
                            
                        </div>
                }
            </div>
        )
    }

    return (
        <div>
            {loading && <div>Validating your email.</div>}
            {!loading && success && <div>
                
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <img src={logo} alt="logo" width='194' height='142' />
                            </div>
                            <div className={styles.title}> Thank you</div >
                            <div className={styles.text}>You can continue to Smart Manager now</div>
                            <Button title='Proceed' className={styles['proceed-button']} onClick={() => history.push('/')} />
                            <div className={styles.cheers}> Cheers,</div >
                            <div className={styles.team}>The Smart Manager Team</div>
                        </div>
                       

            </div>}
        </div>
    )
}

export default ConfirmationPage;
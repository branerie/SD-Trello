import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './index.module.css'
import Button from '../../components/Button'
import UserContext from '../../contexts/UserContext'
import logo from '../../images/logo.svg'
import useUserServices from '../../services/useUserServices'


const ConfirmationPage = () => {
    const { token } = useParams()
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(true)
    const { user, logIn } = useContext(UserContext)
    const { confirmToken } = useUserServices()

    const isFirstRegistration = user.newPasswordConfirmed

    const handleConfirmToken = useCallback(async () => {
        if (token === 'not-confirmed') {
            return
        }

        if (user.confirmed && user.newPasswordConfirmed) {
            return
        }

        const response = await confirmToken(token)
        logIn(response)
        setIsLoading(false)


    }, [token, logIn, user, confirmToken])

    useEffect(() => {
        handleConfirmToken()
    }, [handleConfirmToken])


    if (token === 'not-confirmed') {
        return (
            <div>
                {
                    isFirstRegistration ?
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <img src={logo} alt='logo' width='194' height='142' />
                            </div>
                            <div className={styles.title}>
                                Confirm your email address
                            </div >
                            <div className={styles.text}>
                                Please check your email to confirm your account
                            </div>
                            <div className={styles.text}>
                                Once confirmed, this email address will be uniquely associated with your Smart Manager  account.
                            </div>
                        </div>
                        :
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <img src={logo} alt='logo' width='194' height='142' />
                            </div>
                            <div className={styles.title}>
                                Confirm your new password
                            </div >
                            <div className={styles.text}>
                                Please check your email to confirm your new password
                            </div>
                            <div className={styles.text}>
                                Once confirmed, your new password will be active for your Smart Manager  account.
                            </div>
                        </div>
                }
            </div>
        )
    }

    return (
        <div>
            {
                isLoading ?
                    <div>
                        Validating your email.
                    </div>
                    :
                    <div>
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <img src={logo} alt='logo' width='194' height='142' />
                            </div>
                            <div className={styles.title}>
                                Thank you
                            </div >
                            <div className={styles.text}>
                                You can continue to Smart Manager now
                            </div>
                            <Button
                                title='Proceed'
                                className={styles['proceed-button']}
                                onClick={() => history.push('/')}
                            />
                            <div className={styles.cheers}>
                                Cheers,
                            </div >
                            <div className={styles.team}>
                                The Smart Manager Team
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ConfirmationPage
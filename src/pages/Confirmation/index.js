import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './index.module.css'
import Button from '../../components/Button'
import UserContext from '../../contexts/UserContext'
import authenticate from '../../utils/authenticate'
import logo from '../../images/logo.svg'


const ConfirmationPage = () => {
    const params = useParams()
    const history = useHistory()
    /* REVIEW: Не виждам причина да се ползват два стейта в случая. От началото единия е true, другия false.
        Поне по сегашната логика на компонента - тея два стейта винаги ще са с противоположни стойности.
        Спокойно може да се използва само един от тях
    */
    const [isLoading, setIsLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    /* REVIEW: деструктурирай userContext и вземи само това, което ти трябва в компонента. В случая:
        const { user, logIn } = useContext(UserContext)
    */
    const userContext = useContext(UserContext)
    const isFirstRegistration = userContext.user.newPasswordConfirmed

    const confirmToken = useCallback(async () => {
        const token = params.token
        if (params.token === 'not-confirmed') { // REVIEW: Може да се ползва token константата вместо params.token
            return
        }

        if (userContext.user.confirmed && userContext.user.newPasswordConfirmed) {
            return
        }

        /* REVIEW: Тук помислете за друг вариант да се използва тая authenticate функция (ако няма да е мн сложна промяната). 
            Не е мн яко с две callback функции, а и не ме кефи, че се подава целия URL като параметър. Ако може да се подава 
            само специфичната част. Предполагам authenticate винаги се ползва с api/user, така че да получава само 
            confirmation например. Но ако ще остава така, то поне може да се подреди, за да се разбира по-лесно:
            await authenticate(
                '/api/user/confirmation', 
                'POST', 
                { token }, 
                (user) => {
                    userContext.logIn(user)
                    setIsLoading(false)
                    setSuccess(true)
                }, 
                (response) => {
                    console.log('Error', response)
                }
            )
        */
        await authenticate('/api/user/confirmation', 'POST', {
            token
        }, (user) => {
            userContext.logIn(user)
            setIsLoading(false)
            setSuccess(true)
        }, (response) => {
            console.log('Error', response)
        })

    }, [params.token, userContext])

    useEffect(() => {
        confirmToken()
    }, [confirmToken])

    /* REVIEW: Отварящият и затварящият таг на HTML трябва да са подравнени по вертикала (да са на едно таб ниво) 
               Отдолу има няколко div-a, които са разместени
    */
    if (params.token === 'not-confirmed') {
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
            { /* REVIEW: Ако се махне единия стейт както предложих по-горе, тук може да се направи с ternary
                Според мен най-добре да остане isLoading и да се ползва isLoading ? ... : ...
             */
                isLoading &&
                <div>
                    Validating your email.
                </div>
            }
            {
                !isLoading && success &&
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
                        {/* REVIEW: До колкото виждам от нета (а и на мен ми се струва най-добрия вариант наистина) - ако се 
                            пренасят компоненти на повече от един ред, то всеки prop се пише на отделен ред (както като се 
                            пишат параметрите на функциите по един на ред), като всеки prop е един таб навътре и затварянето 
                            на тага (/>) също е на отделен ред, на едно ниво с отварянето. В случая:
                        <Button 
                            title='Proceed' 
                            className={styles['proceed-button']}
                            onClick={() => history.push('/')} 
                        />
                         */}
                        <Button title='Proceed' className={styles['proceed-button']}
                            onClick={() => history.push('/')} />
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
/* REVIEW: има ; останала  */
export default ConfirmationPage;
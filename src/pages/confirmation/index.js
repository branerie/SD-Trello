import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button";
import UserContext from "../../contexts/UserContext";
import userObject from "../../utils/userObject";

const ConfirmationPage = () => {
    const params = useParams()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const userContext = useContext(UserContext)
    const [firstRegistration, setFirstRegistration] = useState(userContext.user.newPasswordConfirmed)



    const confirmToken = async () => {
        const token = params.token
        if (params.token === 'not-confirmed') {
            return
        }

        if (userContext.user.confirmed && userContext.user.newPasswordConfirmed) {
            history.push("/")
            return
        }
        console.log('predi fethc-a');
        console.log(userContext.user);
        const promise = await fetch('/api/user/confirmation', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                registration: firstRegistration
            })
        })

        const response = await promise.json()

        if (!response) {

            history.push("/error")
            return
        } else {
            const authToken = promise.headers.get("Authorization")
            document.cookie = `x-auth-token=${authToken}`

            // if (response.user.username && authToken) {
            //     userContext.logIn({
            //         username: response.user.username,
            //         id: response.user._id,
            //         inbox: response.user.inbox,
            //         confirmed: response.user.confirmed,
            //         newPasswordConfirmed: response.user.newPasswordConfirmed
            //     })
            // }

            if (response.user.username && authToken) {
                console.log(response.user);
                userContext.logIn({
                    username: response.user.username,
                    id: response.user._id,
                    teams: response.teams,
                    inbox: response.user.inbox,
                    confirmed: response.user.confirmed,
                    newPasswordConfirmed: response.user.newPasswordConfirmed,
                    recentProjects: response.user.recentProjects
                })
                console.log(userContext.user);
            }
            setLoading(false)
            setSuccess(true)
            return
        }
    }

    useEffect(() => {
        confirmToken()
    })


    if (params.token === 'not-confirmed') {
        return (
            <div>
                {
                    firstRegistration ?
                        <div> Please check your email to confirm your account</div >
                        :
                        <div>Please check your email to confirm your new password</div>
                }
            </div>
        )
    }

    return (
        <div>
            {loading && <div>Validating your email.</div>}
            {!loading && success && <div>
                {
                    firstRegistration ?
                        <div>Thank you. Your account has been verified.</div>
                        :
                        <div>Thank you. Your new password has been verified.</div>
                }
                <Button title='Proceed' onClick={() => history.push('/')} />
            </div>}
        </div>
    )
}

export default ConfirmationPage;
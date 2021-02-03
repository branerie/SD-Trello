import React, { useState, useEffect, useContext, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button";
import UserContext from "../../contexts/UserContext";
import authenticate from "../../utils/authenticate";
import userObject from "../../utils/userObject";

const ConfirmationPage = () => {
    const params = useParams()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const userContext = useContext(UserContext)
    const [firstRegistration, setFirstRegistration] = useState(userContext.user.newPasswordConfirmed)



    const confirmToken = useCallback(async () => {
        const token = params.token
        if (params.token === 'not-confirmed') {
            // if (userContext.user.loggedIn) {
            //     console.log('logout');
            //     userContext.logOut(userContext.user)
            //     console.log(userContext.user);
            // }
            return
        }

        if (userContext.user.confirmed && userContext.user.newPasswordConfirmed) {
            // history.push("/")
            return
        }

        console.log('predi fethc-a')
        console.log(userContext.user)
        

        await authenticate('/api/user/confirmation', 'POST', {
            token,
            registration: firstRegistration
        }, (user) => {
            console.log('response', user);

            userContext.logIn(user)

            console.log('userContext', userContext.user);  
         
            
            // history.push("/")
        }, (response) => {

            console.log("Error", response)
        })


        // const promise = await fetch('/api/user/confirmation', {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         token,
        //         registration: firstRegistration
        //     })
        // })

        // const authToken = promise.headers.get("Authorization")
        // const response = await promise.json()

        // if (!response) {

        //     history.push("/error")
        //     return
        // } else {
        //     document.cookie = `x-auth-token=${authToken}`
        //     console.log(authToken);

        //     if (response.user.username && authToken) {
        //         console.log(response.user)
        //         userContext.logIn({
        //             username: response.user.username,
        //             id: response.user._id,
        //             teams: response.teams,
        //             inbox: response.user.inbox,
        //             confirmed: response.user.confirmed,
        //             newPasswordConfirmed: response.user.newPasswordConfirmed,
        //             recentProjects: response.user.recentProjects
        //         })
        //         console.log(userContext.user)
        //     }
        //     setLoading(false)
        //     setSuccess(true)
        //     return
        // }

        setLoading(false)
        setSuccess(true)
    }, [firstRegistration, history, params.token, userContext])

    useEffect(() => {
        confirmToken()
    }, [confirmToken])


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
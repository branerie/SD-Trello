import React, { useState, useEffect, useContext, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button";
import UserContext from "../../contexts/UserContext";
import authenticate from "../../utils/authenticate";

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
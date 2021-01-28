import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button";
import UserContext from "../../contexts/UserContext";

const ConfirmationPage = () => {
    const params = useParams()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const userContext = useContext(UserContext)

    
    const confirmToken = async () => {
        const token = params.token

        
        
        const response = await fetch('/api/user/confirmation', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const user = await response.json()
            console.log(user);
            userContext.logIn({
                username: user.username,
                id: user._id,
                inbox: user.inbox,
                confirmed: user.confirmed
            })
            setLoading(false)
            setSuccess(true)
        }
    }
    
    useEffect(() => {
        confirmToken()
    })
    
    
    if (params.token === 'not-confirmed') {
        return (
            <div>Please check your email to confirm your account</div>
        )
    }

    return (
        <div>
            {loading && <div>Validating your email.</div>}
            {!loading && success && <div>
                <div>Thank you. Your account has been verified.</div>
                <Button title='Proceed' onClick={() => history.push('/')} />
            </div>}
        </div>
    )
}

export default ConfirmationPage;
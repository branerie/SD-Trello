import userObject from "./userObject"

const responseGoogle = async (googleResponse, onSuccess, onFailure) => {

    try {
        const tokenId = googleResponse.tokenId
        const promise = await fetch("/api/user/google-login", {
            method: 'POST',
            body: JSON.stringify({tokenId}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const authToken = promise.headers.get("Authorization")
        document.cookie = `x-auth-token=${authToken}`

        const response = await promise.json()

        if (response.user.username && authToken) {
            onSuccess(userObject(response))
        } else {
            onFailure(response)
        }
        
    } catch (error) {
        onFailure(error)
    }
}

export default responseGoogle
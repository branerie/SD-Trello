const responseGoogle = async (googleResponse, onSuccess, onFailure) => {

    try {
        const tokenId = googleResponse.tokenId
        const promise = await fetch("http://localhost:4000/api/user/google-login", {
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
            onSuccess({
                username: response.user.username,
                id: response.user._id,
                teams: response.teams
            });
        } else {
            onFailure(response)
        }
        
    } catch (error) {
        onFailure(error)
    }
}

export default responseGoogle
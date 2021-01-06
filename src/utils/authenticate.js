const authenticate = async (url, method, body, onSuccess, onFailure) => {
    try {

        const promise = await fetch(url, {
            method,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })

        
        const authToken = promise.headers.get("Authorization")
        const response = await promise.json()

        if (response.needPassword) {
            onFailure(response)
            return
        }
        if (response.wrongPassword) {
            onFailure(response)
            return
        }
        if (response.wrongUser) {
            onFailure(response)
            return
        }

        document.cookie = `x-auth-token=${authToken}`


        if (response.user.username && authToken) {
            onSuccess({
                username: response.user.username,
                id: response.user._id,
                teams: response.teams,
                inbox: response.user.inbox,
                confirmed: response.user.confirmed,
            });
        } else {
            onFailure(response)
        }

    } catch (e) {
        onFailure(e)
    }
}

export default authenticate
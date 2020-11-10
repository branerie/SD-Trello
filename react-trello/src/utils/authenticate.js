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

        document.cookie = `x-auth-token=${authToken}`


        if (response.username && authToken) {
            onSuccess({
                username: response.username,
                id: response._id
            });
        } else {
            onFailure(response)
        }

    } catch (e) {
        onFailure(e)
    }
}

export default authenticate
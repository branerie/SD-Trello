import userObject from './userObject'

const authenticate = async (url, method, body, onSuccess, onFailure) => {
    try {
        
        const promise = await fetch(url, {
            method,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        
        const authToken = promise.headers.get('Authorization')
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
        if (response.exist) {
            onFailure(response)
            return
        }

        document.cookie = `x-auth-token=${authToken};path=/`


        if (response.user.username && authToken) {
            onSuccess(userObject(response));
        } else {
            onFailure(response)
        }

    } catch (e) {
        onFailure(e)
    }
}

export default authenticate
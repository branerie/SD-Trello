import getCookie from './cookie'
import userObject from './userObject'

const authenticateUpdate = async (url, method, body, onSuccess, onFailure) => {

    try {
        
        const cookie = getCookie('x-auth-token')
    
        const promise = await fetch(url, {
            method,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie
            }
        })
        
        const response = await promise.json()
        if (response.user.username) {
            onSuccess(userObject(response))
        } else {
            onFailure()
        }

    } catch (e) {
        onFailure(e)
    }
}

export default authenticateUpdate
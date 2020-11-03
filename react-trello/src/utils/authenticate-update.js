import getCookie from "./cookie";

const authenticateUpdate = async (url, method, body, onSuccess, onFailure) => {
    try {
        const cookie = getCookie('x-auth-token')

        const promise = await fetch(url, {
            method,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": cookie
            }
        })
        
        const response = await promise.json();

        if (response.username) {
            onSuccess({
                username: response.username,
                id: response._id
            });
        } else {
            onFailure();
        }

    } catch (e) {
        onFailure(e);
    }
}

export default authenticateUpdate;
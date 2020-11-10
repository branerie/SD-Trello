import React, { useState, useEffect } from "react"
import UserContext from "./Context"
import getCookie from "./utils/cookie"

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4000";

const App = (props) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const [response, setResponse] = useState("");

    useEffect(() => {

        console.log('use effect');
        const socket = socketIOClient(ENDPOINT, {
            transportOptions: {
              polling: {
                extraHeaders: {
                  'x-clientid': 'abc'
                }
              }
            }
          });
        socket.on("FromAPI", data => {
            setResponse(data);
            console.log(data);
        });
        return () => socket.disconnect();
    }, []);

    const logIn = (user) => {
        setUser({
            ...user,
            loggedIn: true
        })
    }

    const logOut = () => {
        document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"

        setUser({
            loggedIn: false
        })
    }

    useEffect(() => {

        const token = getCookie("x-auth-token")

        if (!token) {
            logOut();
            setLoading(false)
            return;
        }

        fetch("http://localhost:4000/api/user/verify", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(promise => {
            return promise.json()
        }).then(response => {
            if (response.status) {
                logIn({
                    username: response.user.username,
                    id: response.user._id
                })
            } else {
                logOut()
            }

            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <UserContext.Provider value={{
            user,
            logIn,
            logOut
        }}>
            {props.children}
            <p>
                It's <time dateTime={response}>{response}</time>
            </p>
        </UserContext.Provider>
    )
}

export default App
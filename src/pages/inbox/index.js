import React, { useState, useEffect, useCallback, useContext } from "react"
import { useHistory } from "react-router-dom"
import TeamInvitationHistory from "../../components/inbox/history/team-invitation-history"
import TeamInvitation from "../../components/inbox/team-invitation"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import { useSocket } from "../../contexts/SocketProvider"
import UserContext from "../../contexts/UserContext"
import getCookie from "../../utils/cookie"
import userObject from "../../utils/userObject"
import styles from './index.module.css'

const InboxPage = () => {
    const [inbox, setInbox] = useState([])
    const [inboxHistory, setInboxHistory] = useState([])
    const history = useHistory()
    const socket = useSocket()
    const userContext = useContext(UserContext)
    const logIn = userContext.logIn
    const token = getCookie("x-auth-token")
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

    const getInbox = useCallback(async () => {
        const response = await fetch('/api/user/inbox', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push('/error')
            return
        } else {
            const user = await response.json()
            setInbox(user.inbox)
            setInboxHistory(user.inboxHistory)
        }
    }, [history, token])

    useEffect(() => {
        getInbox()
    }, [getInbox])

    const updateUser = useCallback(async (response) => {
        const user = userObject(response)
        logIn(user)
        setInbox(response.inboxUser.inbox)
        setInboxHistory(response.inboxUser.inboxHistory)
    }, [logIn])

    useEffect (() => {
        if (socket) {
            socket.on('message-sent', updateUser)
            return () => socket.off('message-sent')
        }
    }, [socket, updateUser])

    return (
        <PageLayout>
            <div>
                <Title title='Inbox' />
                {
                    inbox.length === 0 && <div className={styles.title}>Inbox is empty</div>
                }
                {
                    inbox.filter(m => m.subject === "Team invitation")
                        .map(m => {
                            return <TeamInvitation key={m._id} message={m} setInbox={setInbox} setInboxHistory={setInboxHistory} options={options} />
                        })
                }
            </div>

            {
                inboxHistory.length !== 0 && 
                <div>
                    <Title title='History' />
                    {
                        inboxHistory.filter(m => m.subject === "Team invitation")
                            .map(m => {
                                return <TeamInvitationHistory key={m._id} message={m} options={options} setInboxHistory={setInboxHistory} />
                            })
                    }
                </div>
            }
        </PageLayout>
    )
}

export default InboxPage;
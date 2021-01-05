import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import Button from "../../components/button"
import PageLayout from "../../components/page-layout"
import UserContext from "../../contexts/UserContext"
import getCookie from "../../utils/cookie"
import styles from './index.module.css'

const InboxPage = () => {
    const [inbox, setInbox] = useState([])
    const userContext = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        const arr = userContext.user.inbox.map(m => JSON.parse(m))
        setInbox(arr)
    }, [userContext.user.inbox])

    async function acceptInvitation(message, accepted) {
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/teams/invitations/${message.teamId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                messageId: message.id,
                accepted,
                teamName: message.teamName
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const arr = inbox.filter( m => m.id !== message.id)
            setInbox(arr)
            if (accepted) {
                history.push(`/team/${message.teamId}`)
            }
        }
    }

    return (
        <PageLayout>
            <div>
                {
                    inbox.length === 0 && <div className={styles.title}>Inbox is empty</div>
                }
                {
                    inbox.filter(m => m.subject === "Team invitation")
                        .map((m, index) => {
                            return <div key={index} className={styles.message}>
                                <div>{m.subject}</div>
                                Team name: <span>{m.teamName}</span>
                                <div>
                                    <Button
                                        className={styles.button}
                                        onClick={() => acceptInvitation(m, true)}
                                        title='Accept'
                                    />
                                    <Button
                                        className={styles.button}
                                        onClick={() => acceptInvitation(m, false)}
                                        title='Decline'
                                    />
                                </div>
                            </div>
                        })
                }
            </div>
        </PageLayout>
    )
}

export default InboxPage;
import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import Button from "../../components/button"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import UserContext from "../../contexts/UserContext"
import getCookie from "../../utils/cookie"
import styles from './index.module.css'

const InboxPage = () => {
    const [inbox, setInbox] = useState([])
    const [inboxHistory, setInboxHistory] = useState([])
    const userContext = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        setInbox(userContext.user.inbox)
        setInboxHistory(userContext.user.inboxHistory)
    }, [userContext.user.inbox, userContext.user.inboxHistory])

    async function acceptInvitation(message, accepted) {
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/teams/invitations/${message.teamId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                message,
                accepted
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const arr = inbox.filter(m => m._id !== message._id)
            setInbox(arr)
            if (accepted) {
                history.push(`/team/${message.teamId}`)
            }
        }
    }

    return (
        <PageLayout>
            <Title title='Inbox' />
            <div>
                {
                    inbox.length === 0 && <div className={styles.title}>Inbox is empty</div>
                }
                {
                    inbox.filter(m => m.subject === "Team invitation")
                        .map(m => {
                            return <div key={m._id} className={styles.message}>
                                <div className={styles.container}>
                                    <div className={styles.bold}>{m.subject}</div>
                                    <div>date</div>
                                </div>
                                <div>
                                    <div className={`${styles.bold} ${styles.inline}`}>Team name:</div>
                                    <div className={styles.inline}>{m.team.name}</div>
                                </div>
                                <div>
                                    <div className={`${styles.bold} ${styles.inline}`}>Invited by:</div>
                                    <div className={styles.inline}>{m.invitedBy.name}</div>
                                </div>
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
            <Title title='History' />
            {
                inboxHistory.length === 0 && <div className={styles.title}>No history</div>
            }
            {/* {
                inboxHistory.filter(m => m.subject === "Team invitation")
                    .map((m, index) => {
                        return <div key={index} className={styles.message}>
                            <div className={styles.container}>
                                <div className={styles.bold}>{m.subject}</div>
                                <div>date</div>
                            </div>
                            <div>
                                <div className={`${styles.bold} ${styles.inline}`}>Team name:</div>
                                <div className={styles.inline}>{m.teamName}</div>
                            </div>
                            <div>
                                <div className={`${styles.bold} ${styles.inline}`}>Invited by:</div>
                                <div className={styles.inline}>{m.teamName}</div>
                            </div>
                            <div>

                            </div>
                        </div>
                    })
            } */}
        </PageLayout>
    )
}

export default InboxPage;
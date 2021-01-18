import React, { useState, useEffect, useCallback } from "react"
import { useHistory } from "react-router-dom"
import TeamInvitationHistory from "../../components/inbox/history/team-invitation-history"
import TeamInvitation from "../../components/inbox/team-invitation"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import getCookie from "../../utils/cookie"
import styles from './index.module.css'

const InboxPage = () => {
    const [inbox, setInbox] = useState([])
    const [inboxHistory, setInboxHistory] = useState([])
    const history = useHistory()
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
                                return <TeamInvitationHistory key={m._id} message={m} options={options} />
                            })
                    }
                </div>
            }
        </PageLayout>
    )
}

export default InboxPage;
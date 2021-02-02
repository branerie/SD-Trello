import React, { useState, useEffect, useCallback } from "react"
import { useHistory } from "react-router-dom"
import TeamInvitationInbox from "../../components/inbox/team-invitation-inbox"
import TeamInvitationHistory from "../../components/inbox/team-invitation-history"
import TeamInvitationResponse from "../../components/inbox/team-invitation-response"
import TaskAssignment from "../../components/inbox/task-assignment"
import PageLayout from "../../components/page-layout"
import Title from "../../components/title"
import { useSocket } from "../../contexts/SocketProvider"
import getCookie from "../../utils/cookie"
import styles from './index.module.css'
import TeamDeleted from "../../components/inbox/team-deleted"
import ProjectDeleted from "../../components/inbox/project-deleted"

const InboxPage = () => {
    const [inbox, setInbox] = useState([])
    const [inboxHistory, setInboxHistory] = useState([])
    const history = useHistory()
    const socket = useSocket()
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
        setInbox(response.inboxUser.inbox)
        setInboxHistory(response.inboxUser.inboxHistory)
    }, [])

    useEffect(() => {
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
                    [...inbox].reverse().map(m => {
                        switch (m.subject) {
                            case 'Team invitation':
                                return <TeamInvitationInbox
                                    key={m._id}
                                    message={m}
                                    setInbox={setInbox}
                                    setInboxHistory={setInboxHistory}
                                    options={options}
                                />

                            case 'Team invitation response':
                                return <TeamInvitationResponse
                                    key={m._id}
                                    message={m}
                                    setInbox={setInbox}
                                    setInboxHistory={setInboxHistory}
                                    options={options}
                                    isInbox={true}
                                />

                            case 'Task assignment':
                                return <TaskAssignment
                                    key={m._id}
                                    message={m}
                                    setInbox={setInbox}
                                    setInboxHistory={setInboxHistory}
                                    options={options}
                                    isInbox={true}
                                />

                            case 'Team deleted':
                                return <TeamDeleted
                                    key={m._id}
                                    message={m}
                                    setInbox={setInbox}
                                    setInboxHistory={setInboxHistory}
                                    options={options}
                                    isInbox={true}
                                />

                            case 'Project deleted':
                                return <ProjectDeleted
                                    key={m._id}
                                    message={m}
                                    setInbox={setInbox}
                                    setInboxHistory={setInboxHistory}
                                    options={options}
                                    isInbox={true}
                                />

                            default:
                                break
                        }
                        return ''
                    })
                }
            </div>

            {
                inboxHistory.length !== 0 &&
                <div>
                    <Title title='History' />
                    {
                        [...inboxHistory].reverse().map(m => {
                            switch (m.subject) {
                                case 'Team invitation':
                                    return <TeamInvitationHistory
                                        key={m._id}
                                        message={m}
                                        setInbox={setInbox}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                    />

                                case 'Team invitation response':
                                    return <TeamInvitationResponse
                                        key={m._id}
                                        message={m}
                                        setInbox={setInbox}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                    />

                                case 'Task assignment':
                                    return <TaskAssignment
                                        key={m._id}
                                        message={m}
                                        setInbox={setInbox}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                    />

                                case 'Team deleted':
                                    return <TeamDeleted
                                        key={m._id}
                                        message={m}
                                        setInbox={setInbox}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                    />

                                case 'Project deleted':
                                    return <ProjectDeleted
                                        key={m._id}
                                        message={m}
                                        setInbox={setInbox}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                    />

                                default:
                                    break;
                            }
                            return ''
                        })
                    }
                </div>
            }
        </PageLayout>
    )
}

export default InboxPage;
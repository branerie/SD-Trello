import React, { useState, useEffect, useCallback } from 'react'
import TeamInvitationInbox from '../../components/Inbox/TeamInvitationInbox'
import TeamInvitationHistory from '../../components/Inbox/TeamInvitationHistory'
import TeamInvitationResponse from '../../components/Inbox/TeamInvitationResponse'
import TaskAssignment from '../../components/Inbox/TaskAssignment'
import PageLayout from '../../components/PageLayout'
import Title from '../../components/Title'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import TeamDeleted from '../../components/Inbox/TeamDeleted'
import ProjectDeleted from '../../components/Inbox/ProjectDeleted'
import TeamInvitationCanceled from '../../components/Inbox/TeamInvitationCanceled'
import useUserServices from '../../services/useUserServices'

const InboxPage = () => {
    const [inbox, setInbox] = useState([])
    const [inboxHistory, setInboxHistory] = useState([])
    const socket = useSocket()
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    const { getUserInbox } = useUserServices()


    const getInbox = useCallback(async () => {
        // if (inbox.length > 0 || inboxHistory.length > 0) {
        //     return
        // }
        const user = await getUserInbox()
        setInbox(user.inbox)
        setInboxHistory(user.inboxHistory)
        
    }, [getUserInbox])

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

                            case 'Team invitation canceled':
                                return <TeamInvitationCanceled
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

                                case 'Team invitation canceled':
                                    return <TeamInvitationCanceled
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
import React, { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import TeamInvitationInbox from '../../components/Inbox/TeamInvitationInbox'
import TeamInvitationHistory from '../../components/Inbox/TeamInvitationHistory'
import TeamInvitationResponse from '../../components/Inbox/TeamInvitationResponse'
import TaskAssignment from '../../components/Inbox/TaskAssignment'
import Title from '../../components/Title'
import ElementDeleted from '../../components/Inbox/ElementDeleted'
import TeamInvitationCanceled from '../../components/Inbox/TeamInvitationCanceled'
import useUserServices from '../../services/useUserServices'

const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

const InboxPage = () => {
    const [inbox, setInbox] = useState([])
    const [inboxHistory, setInboxHistory] = useState([])
    const socket = useSocket()
    const { getUserInbox } = useUserServices()

    const getInbox = useCallback(async () => {
        const user = await getUserInbox()
        setInbox(user.inbox.reverse())
        setInboxHistory(user.inboxHistory.reverse())
    }, [getUserInbox])

    useEffect(() => {
        getInbox()
    }, [getInbox])

    const updateUser = useCallback(async (response) => {
        setInbox(response.inboxUser.inbox.reverse())
        setInboxHistory(response.inboxUser.inboxHistory.reverse())
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on('message-sent', updateUser)
            return () => socket.off('message-sent')
        }
    }, [socket, updateUser])

    return (
        <PageLayout>
            <Title title='Inbox' />
            {
                inbox.length === 0 && <div className={styles.title}>Inbox is empty</div>
            }
            {
                inbox.map(m => {
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
                                setInboxHistory={setInboxHistory}
                                options={options}
                                isInbox={true}
                            />

                        case 'Team invitation canceled':
                            return <TeamInvitationCanceled
                                key={m._id}
                                message={m}
                                setInboxHistory={setInboxHistory}
                                options={options}
                                isInbox={true}
                            />

                        case 'Task assignment':
                            return <TaskAssignment
                                key={m._id}
                                message={m}
                                setInboxHistory={setInboxHistory}
                                options={options}
                                isInbox={true}
                            />

                        case 'Team deleted':
                            return <ElementDeleted
                                key={m._id}
                                message={m}
                                setInboxHistory={setInboxHistory}
                                options={options}
                                isInbox={true}
                                deletedElement={'Team'}
                            />

                        case 'Project deleted':
                            return <ElementDeleted
                                key={m._id}
                                message={m}
                                setInboxHistory={setInboxHistory}
                                options={options}
                                isInbox={true}
                                deletedElement={'Project'}
                            />

                        default:
                            break
                    }

                    return ''
                })
            }
            {
                inboxHistory.length !== 0 &&
                <>
                    <Title title='History' />
                    {
                        inboxHistory.map(m => {
                            switch (m.subject) {
                                case 'Team invitation':
                                    return <TeamInvitationHistory
                                        key={m._id}
                                        message={m}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                    />

                                case 'Team invitation response':
                                    return <TeamInvitationResponse
                                        key={m._id}
                                        message={m}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                    />

                                case 'Team invitation canceled':
                                    return <TeamInvitationCanceled
                                        key={m._id}
                                        message={m}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                    />

                                case 'Task assignment':
                                    return <TaskAssignment
                                        key={m._id}
                                        message={m}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                    />

                                case 'Team deleted':
                                    return <ElementDeleted
                                        key={m._id}
                                        message={m}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                        deletedElement={'Team'}
                                    />

                                case 'Project deleted':
                                    return <ElementDeleted
                                        key={m._id}
                                        message={m}
                                        setInboxHistory={setInboxHistory}
                                        options={options}
                                        isInbox={false}
                                        deletedElement={'Project'}
                                    />

                                default:
                                    break
                            }

                            return ''
                        })
                    }
                </>
            }
        </PageLayout>
    )
}

export default InboxPage
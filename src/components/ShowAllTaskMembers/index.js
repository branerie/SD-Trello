import React, { useState } from 'react'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import ConfirmDialog from '../ConfirmationDialog'
import AvatarUser from '../AvatarUser'
import useCardsServices from '../../services/useCardsServices'


const ShowAllTaskMembers = ({ members, deleteMemberOption, deleteMemberObj }) => {
    const socket = useSocket()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [currElement, setCurrElement] = useState('')
    const { editTask } = useCardsServices()

    function onClick(m) {
        if (deleteMemberOption) {
            setIsConfirmOpen(true)
            setCurrElement(m)
        }
    }

    const updateSocket = () => {
        const { project, teamId } = deleteMemberObj

        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }

    const deleteMember = async (member) => {
        const { cardMembers, setCardMembers, cardId, listId } = deleteMemberObj

        const index = cardMembers.indexOf(member)
        const members = [...cardMembers]

        if (index !== -1) {
            members.splice(index, 1)
        }

        const editedFields = { members }
        await editTask(listId, cardId, editedFields)

        updateSocket()
        setCardMembers(members)
    }

    return (
        <>
            {isConfirmOpen &&
                <ConfirmDialog
                    title={'delete this member'}
                    hideConfirm={() => setIsConfirmOpen(false)}
                    onConfirm={() => deleteMember(currElement)}
                />
            }
            <div className={styles['all-card-members']}>
                {members.map((m, index) => {
                    return (
                        <div key={index} className={styles['each-member']} onClick={() => onClick(m)} >
                            <div className={styles.name}>
                                <span className={styles.avatar} key={m._id}>
                                    <AvatarUser user={m}
                                        size={30}
                                        className={styles.avatar}
                                    />
                                </span>
                                <span className={styles.username}>{m.username}</span>
                            </div>
                            { deleteMemberOption && <span className={styles['delete-icon']}>x</span>}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default ShowAllTaskMembers
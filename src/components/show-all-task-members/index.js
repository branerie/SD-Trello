import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import styles from './index.module.css'
import ConfirmDialog from '../confirmation-dialog'
import AvatarUser from '../avatar-user'


export default function ShowAllTaskMembers({ members, deleteMemberOption, deleteMemberObj }) {
    const token = getCookie("x-auth-token")
    const history = useHistory()
    const socket = useSocket()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currElement, setCurrElement] = useState('')

    function onClick(m) {
        if (deleteMemberOption) {
            setConfirmOpen(true)
            setCurrElement(m)
        }
    }


    const updateSocket = () => {
        const project = deleteMemberObj.project
        const teamId = deleteMemberObj.teamId

        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }

    const deleteMember = async (member) => {
        const cardMembers = deleteMemberObj.cardMembers
        const setCardMembers = deleteMemberObj.setCardMembers
        const cardId = deleteMemberObj.cardId
        const listId = deleteMemberObj.listId

        var index = cardMembers.indexOf(member)
        let arr = [...cardMembers]

        if (index !== -1) {
            arr.splice(index, 1)
        }

        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                members: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const updatedCard = await response.json()
            deleteMemberObj.setCurrCard(updatedCard)
            updateSocket()
            setCardMembers(arr)
        }

    }

    return (
        <div>
            {confirmOpen &&
                <ConfirmDialog
                    title={'delete this member'}
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={() => deleteMember(currElement)}
                />
            }
            <div className={styles['all-card-members']}>
                {members.map((m, index) => {
                    return (
                        <div key={index} className={styles['each-member']} onClick={() => onClick(m)} >
                            <span className={styles.avatar} key={m._id}>
                                <AvatarUser user={m}
                                    size={30}
                                    className={styles.avatar}
                                />
                            </span>
                            <span>{m.username}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}







import React from 'react'
import Avatar from 'react-avatar'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import styles from './index.module.css'


export default function ShowAllTaskMembers({ members, deleteMemberOption, deleteMemberObj }) {
    const token = getCookie("x-auth-token")
    const history = useHistory()
    const socket = useSocket()

    function onClick(m) {
        if (deleteMemberOption) {
            if (window.confirm('Are you sure you wish to delete this member?')) deleteMember(m)
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
            updateSocket()
            setCardMembers(arr)
        }

    }

    return (
        <div className={styles.containerMemb}>
        <div className={styles.allCardMembers}>
           {
            members.map((m, index) => {
                return (
                    <div key={index} className={styles.eachMember} onClick={() => onClick(m)} >
                        <span className={styles.avatar} key={m._id}>
                                            <Avatar key={m._id}
                                                name={m.username}
                                                size={30}
                                                round={true}
                                                maxInitials={2}
                                                className={styles.avatar}
                                            />
                                        </span>
                        <span>{m.username}</span>
                        </div>
                )
            })
        }
        </div>
        </div>
    )
}







import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import pic10 from '../../images/edit-card/pic10.svg'
import MembersList from '../MembersList'
import useProjectsServices from '../../services/useProjectsServices'
import useCardsServices from '../../services/useCardsServices'


export default function TaskMembers({ card, listId, project, teamId }) {
    const [cardMembers, setCardMembers] = useState(null)
    const [isActive, setIsActive, ref] = useDetectOutsideClick()
    const [users, setUsers] = useState([])
    const history = useHistory()
    const socket = useSocket()
    const token = getCookie('x-auth-token')
    const { addProjectMember } = useProjectsServices()
    const { addTaskMember } = useCardsServices()

    useEffect(() => {
        setCardMembers(card.members)
    }, [card.members])

    const getTeamUsers = async () => {

        const response = await fetch(`/api/teams/get-users/${teamId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })

        if (!response.ok) {
            history.push('/error')
        }
        const data = await response.json()

        let filtered = data.members

        for (let member in cardMembers) {
            filtered = filtered.filter((obj) => obj._id !== cardMembers[member]._id)
        }
        setUsers(filtered)

    }

    const handleSelect = async (id) => {
        if (id === 'select') return

        const selectedUser = users.filter(u => u._id === id)[0]

        const result = project.membersRoles.filter(p => p.memberId._id === selectedUser._id)[0]

        if (!result) {
            if (!window.confirm(`Do you want to add ${selectedUser.username} to project?`)) return

            await addProjectMember(project._id, selectedUser)
        }

        const members = [...cardMembers, selectedUser]

        await addTaskMember(listId, card._id, members, selectedUser, teamId, project._id)

        setIsActive(!isActive)
        setCardMembers(members)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
        socket.emit('message-sent', selectedUser._id)
    }

    return (
        <div>
            <div className={styles['small-buttons']} onClick={() => { getTeamUsers(); setIsActive(!isActive) }} >
                <img className={styles.pics} src={pic10} alt='pic10' />
                Add Teammate
            </div>
            { isActive && <form ref={ref} >
                <select className={styles.select} onChange={e => { handleSelect(e.target.value) }}>
                    <option value={'select'}>Select</option>
                    {users.map(m => (
                        <option key={m._id} value={m._id}>{m.username}</option>
                    ))}
                </select>
            </form>}
            { !isActive && card.members.length > 0 && <div className={styles.members}>
                <MembersList
                    members={card.members}
                    maxLength={4}
                    deleteMemberOption={true}
                    deleteMemberObj={{
                        cardMembers,
                        setCardMembers,
                        cardId: card._id,
                        listId,
                        project,
                        teamId,
                    }}
                />
            </div>}
        </div >
    )
}


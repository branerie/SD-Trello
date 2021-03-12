import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import { useSocket } from '../../contexts/SocketProvider'
import pic10 from '../../images/edit-card/pic10.svg'
import MembersList from '../MembersList'
import useProjectsServices from '../../services/useProjectsServices'
import useCardsServices from '../../services/useCardsServices'
import useTeamServices from '../../services/useTeamServices'


export default function TaskMembers({ card, listId, project, teamId }) {
    const [cardMembers, setCardMembers] = useState(null)
    const [isActive, setIsActive, ref] = useDetectOutsideClick()
    const [users, setUsers] = useState([])
    const socket = useSocket()
    const { addProjectMember } = useProjectsServices()
    const { addTaskMember } = useCardsServices()
    const { getTeamUsers } = useTeamServices()


    useEffect(() => {
        setCardMembers(card.members)
    }, [card.members])

    const handleGetTeamUsers = async () => {
        const data = await getTeamUsers(teamId)
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
            <div className={styles['small-buttons']} onClick={() => { handleGetTeamUsers(); setIsActive(!isActive) }} >
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


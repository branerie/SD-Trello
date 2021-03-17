import React, { useEffect, useState } from 'react'
import { useSocket } from '../../../contexts/SocketProvider'
import commonStyles from '../index.module.css'
import styles from './index.module.css'
import MembersList from '../../MembersList'
import useCardsServices from '../../../services/useCardsServices'
import useProjectsServices from '../../../services/useProjectsServices'
import useTeamServices from '../../../services/useTeamServices'
import membersPic from '../../../images/edit-card/members.svg'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import ConfirmDialog from '../../ConfirmationDialog'

const TaskMembers = ({ card, listId, project, teamId }) => {
    const socket = useSocket()
    const [users, setUsers] = useState([])
    const [cardMembers, setCardMembers] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isActive, setIsActive, ref] = useDetectOutsideClick()
    const { addProjectMember } = useProjectsServices()
    const { addTaskMember } = useCardsServices()
    const { getTeamUsers } = useTeamServices()

    useEffect(() => {
        setCardMembers(card.members)
    }, [card.members])

    const handleGetTeamUsers = async () => {
        const data = await getTeamUsers(teamId)
        let teamUsers = data.members

        for (const member in cardMembers) {
            teamUsers = teamUsers.filter((obj) => obj._id !== cardMembers[member]._id)
        }
        setUsers(teamUsers)
    }

    const handleSelect = (id) => {
        if (id === 'select') return

        const user = users.find(u => u._id === id)
        setSelectedUser(user)

        const result = project.membersRoles.filter(p => p.memberId._id === user._id)[0]

        if (!result) {
            setIsConfirmOpen(true)
            return
        }
        
        handleAddTaskMember(false, user)
    }
    
    const onClick = () => {
        handleGetTeamUsers()
        setIsActive(!isActive)
    }
    
    const handleAddTaskMember = async (shouldAddProjectMebmer, user) => {
        if (shouldAddProjectMebmer) {
            await addProjectMember(project._id, user)
        }

        const members = [...cardMembers, user]

        await addTaskMember(listId, card._id, members, user, teamId, project._id)

        setIsActive(!isActive)
        setCardMembers(members)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
        socket.emit('message-sent', user._id)
    }

    return (
        <div>
            <div className={commonStyles['small-buttons']} onClick={onClick} >
                <img className={commonStyles.pics} src={membersPic} alt='' />
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
            {isConfirmOpen &&
                <ConfirmDialog
                    title={`add ${selectedUser.username} to project`}
                    hideConfirm={() => setIsConfirmOpen(false)}
                    onConfirm={() => handleAddTaskMember(true, selectedUser)}
                />
            }
        </div >
    )
}

export default TaskMembers
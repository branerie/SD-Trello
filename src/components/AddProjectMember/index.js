import React, { useCallback, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './index.module.css'
import { useSocket } from '../../contexts/SocketProvider'
import TeamContext from '../../contexts/TeamContext'
import UserContext from '../../contexts/UserContext'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import ConfirmDialog from '../ConfirmationDialog'
import AvatarUser from '../AvatarUser'
import ButtonClean from '../ButtonClean'
import useProjectsServices from '../../services/useProjectsServices'
import useTeamServices from '../../services/useTeamServices'


export default function AddProjectMember(props) {

    const socket = useSocket()
    const [users, setUsers] = useState([])
    const context = useContext(UserContext)
    const teamContext = useContext(TeamContext)
    const [isActive, setIsActive] = useState(false)
    const [showMembers, setShowMembers] = useState(false)
    const [member, setMember] = useState('')
    const [members, setMembers] = useState(props.project.membersRoles)
    const isAdmin = props.admin
    const projectId = props.project._id
    const params = useParams()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmTitle, setConfirmTitle] = useState('')
    const [currElement, setCurrElement] = useState('')
    const { changeUserRole, addProjectMember, removeProjectMember } = useProjectsServices()
    const { getTeamUsers } = useTeamServices()


    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
        socket.emit('team-update', params.teamid)
    }, [socket, props, params.teamid])

    async function handleOnDragEnd(result) {

        if (!result.destination) {
            console.log('no destination');
            return
        }

        const memberRoleId = result.draggableId

        const member = members.filter(a => a._id === memberRoleId)[0]['memberId']

        if (member._id === context.user.id) {
            console.log('can`t move self');
            return
        }

        const memberAdmin = members.filter(a => a._id === memberRoleId)[0]['admin']

        if (result.destination.droppableId === 'admins' && memberAdmin) {
            return
        }

        if (result.destination.droppableId === 'members' && !memberAdmin) {
            return
        }

        let arr = [...members]
        let newArr = arr.filter(m => m._id !== memberRoleId)
        let updatedUser = members.filter(a => a._id === memberRoleId)[0]
        updatedUser.admin = !memberAdmin
        newArr.push(updatedUser)
        setMembers(newArr)

        await changeUserRole(projectId, memberRoleId, memberAdmin)

        updateProjectSocket()

    }

    const deleteMember = async (member) => {
        if (member._id === context.user.id) {
            return
        }

        await removeProjectMember(projectId, member._id)

        updateProjectSocket()
        let arr = [...members]
        let newArr = arr.filter(m => m.memberId._id !== member._id)
        setMembers(newArr)
    }

    const handleAdd = async (member) => {

        if (!member) {
            setIsActive(!isActive)
            return
        }

        const memberRole = await addProjectMember(projectId, member)
        updateProjectSocket()
        memberRole.memberId = member
        setIsActive(!isActive)
        let arr = [...members]
        arr.push(memberRole)
        setMembers(arr)
        setUsers([])
    }

    const onFocus = async () => {

        if (users.length === 0) {
            let currentTeamId = ''

            teamContext.teams.map(t => {
                return (
                    t.projects.map(p => {
                        if (p._id === projectId) {
                            currentTeamId = t._id
                        }
                        return currentTeamId
                    })
                )
            })

            const data = await getTeamUsers(currentTeamId)

            let teamUsers = data.members

            const filtered = teamUsers.filter((e) => {
                const found = members.find(element => element.memberId.username === e.username)
                if (found) {
                    return false
                } else {
                    return true
                }
            })

            setUsers(filtered)
        }

        setShowMembers(true)


    }

    const onBlur = () => {
        setTimeout(() => setShowMembers(false), 120)
    }


    let confirmationObjectFunctions = {
        'delete this member': deleteMember
    }

    return (
        <div className={styles.container}>
            {confirmOpen &&
                <ConfirmDialog
                    title={confirmTitle}
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={() => confirmationObjectFunctions[confirmTitle](currElement)}
                />
            }
            <div className={styles['big-container']}>
                {isAdmin ?
                    <div>
                        <div className={styles['input-container']}>
                            <span className={styles['text-invite']}>Add Members</span>
                            <div className={styles['invite-input']}>
                                <input
                                    className={styles['members-input']}
                                    autoComplete='off'
                                    value={member}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={(e) => setMember(e.target.value)}
                                    label='Invite members'
                                    id='members'
                                    placeholder='Teammate Username'
                                />
                                <div className={styles['select-for-invite']}>
                                    {
                                        showMembers &&
                                        <div className={styles.members}>
                                            {
                                                users.filter(u => u.username.toLowerCase().includes(member.toLowerCase()) && !u.username.includes(context.user.username))
                                                    .filter((e) => {
                                                        const found = members.find(element => element.username === e.username)
                                                        if (found) {
                                                            return false
                                                        } else {
                                                            return true
                                                        }
                                                    })
                                                    .sort((a, b) => a.username.localeCompare(b.username))
                                                    .map(u => {
                                                        return (
                                                            <ButtonClean
                                                                key={u._id}
                                                                className={styles.user}
                                                                onClick={() => { handleAdd(u) }}
                                                                title={<div>
                                                                    <div>{u.username}</div>
                                                                    <div className={styles.email}>{u.email}</div>
                                                                </div>}
                                                            />)
                                                    })
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <div className={styles['admins-container']}>
                                <span className={styles.title}>Admins:</span>
                                <Droppable droppableId={'admins'}>
                                    {(provided) => (
                                        <div className={styles.droppable} ref={provided.innerRef}  {...provided.droppableProps} >
                                            {
                                                members.filter(a => a.admin === true).map((element, index) => {
                                                    return (
                                                        <Draggable key={element.memberId._id} draggableId={element._id} index={index}>
                                                            {(provided) => (
                                                                <span {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                                    <AvatarUser user={element.memberId}
                                                                        size={40} />
                                                                    {provided.placeholder}
                                                                </span>
                                                            )}
                                                        </Draggable>
                                                    )
                                                })
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>

                            <div className={styles['members-container']}>
                                <span className={styles.title}>Members:</span>
                                <Droppable droppableId={'members'}>
                                    {(provided) => (
                                        <div className={styles['droppable-members']} ref={provided.innerRef} {...provided.droppableProps}>
                                            {
                                                members.filter(a => a.admin !== true).map((element, index) => {
                                                    return (
                                                        <Draggable key={element.memberId._id} draggableId={element._id} index={index} >
                                                            {(provided) => (

                                                                <span {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                                    <AvatarUser user={element.memberId}
                                                                        // key={index} 
                                                                        size={40} round={true}
                                                                        onClick={() => {
                                                                            setConfirmOpen(true)
                                                                            setConfirmTitle('delete this member')
                                                                            setCurrElement(element.memberId)
                                                                        }}
                                                                    />
                                                                    {provided.placeholder}
                                                                </span>
                                                            )}
                                                        </Draggable>
                                                    )
                                                })
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </DragDropContext>
                    </div>
                    :
                    <div>
                        <div className={styles['admins-container']}>
                            <span className={styles.title}>Admins:</span>
                            <div className={styles.droppable}>
                                {
                                    members.filter(a => a.admin === true).map((element, index) => {
                                        return (
                                            <span key={index} >
                                                <AvatarUser user={element.memberId} size={40} />
                                            </span>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className={styles['admins-container']}>
                            <span className={styles.title}>Members:</span>
                            <div className={styles.droppable}>
                                {
                                    members.filter(a => a.admin !== true).map((element, index) => {
                                        return (
                                            <span key={index}>                                                                                                <AvatarUser user={element.memberId} size={40} />
                                            </span>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

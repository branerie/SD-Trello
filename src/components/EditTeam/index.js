import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './index.module.css'
import TeamContext from '../../contexts/TeamContext'
import ButtonClean from '../ButtonClean'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import TeamMembers from '../TeamMembers'
import ButtonGrey from '../ButtonGrey'
import ConfirmDialog from '../ConfirmationDialog'
import AvatarUser from '../AvatarUser'
import useTeamServices from '../../services/useTeamServices'
import useUserServices from '../../services/useUserServices'


export default function EditTeam(props) {
    const socket = useSocket()
    const params = useParams()
    const history = useHistory()
    const [currTeam, setCurrTeam] = useState(props.currTeam)
    const [name, setName] = useState(currTeam.name)
    const [description, setDescription] = useState(currTeam.description)
    const [member, setMember] = useState('')
    const [members, setMembers] = useState(currTeam.members)
    const [invited, setInvited] = useState(currTeam.requests)
    const [forInvite, setForInvite] = useState([])
    const [areMembersShown, setAreMembersShown] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [confirmTitle, setConfirmTitle] = useState('')
    const [currElement, setCurrElement] = useState('')
    const { user } = useContext(UserContext)
    const { setSelectedTeam } = useContext(TeamContext)
    const { getAllUsers } = useUserServices()
    const { updateTeam, removeTeamInvitations, deleteTeam } = useTeamServices()

    const teamId = params.teamid

    const getData = useCallback(() => {
        user.teams.forEach(team => {
            if (team._id === teamId) {
                setCurrTeam(team)
            }
        })
        const teamAuthor = currTeam.author
        setMembers(currTeam.members)
        setInvited(currTeam.requests)
        setDescription(currTeam.description)
        setName(currTeam.name)
        if (user.id === teamAuthor) {
            setIsAdmin(true)
        }
    }, [user, currTeam.author, currTeam.description, currTeam.members, currTeam.name, currTeam.requests, teamId])

    useEffect(() => {
        getData()
    }, [getData])

    const inputMembers = async (event) => {
        setMember(event.target.value)
        setAreMembersShown(false)
        if (allUsers.length === 0) {
            const users = await getAllUsers()
            setAllUsers(users)
        }

        if (member.length >= 2) {
            setAreMembersShown(true)
        }
    }

    const addMember = (input) => {
        const membersForInvite = [...forInvite]
        membersForInvite.push(input)
        setForInvite(membersForInvite)
        setAreMembersShown(false)
        setMember('')
    }

    const removeTeamMember = async (member) => {
        const updatedMembers = members.filter(m => m._id !== member._id)
        await updateTeam(teamId, name, description, updatedMembers)
        socket.emit('team-update', teamId)
        if (member.id === user.id) {
            history.push('/')
        }
    }

    const removeInvitation = async (input) => {
        const removeInvitation = input
        await removeTeamInvitations(teamId, removeInvitation)
        getData()
        socket.emit('team-update', teamId)
        socket.emit('message-sent', input._id)
    }

    const removeMemberForInvite = (input) => {
        const membersForInvite = forInvite.filter(u => u._id !== input._id)
        setForInvite(membersForInvite)
    }

    const handleSubmit = async () => {
        await updateTeam(teamId, name, description, members, forInvite)
        setSelectedTeam(name)
        getData()
        socket.emit('team-update', teamId)
        socket.emit('multiple-messages-sent', forInvite)
        props.hideForm()
    }

    const handleDeleteTeam = async () => {
        if (!window.confirm('You will lost all team information - projects, lists and tasks')) {
            return
        }

        const deletedTeam = await deleteTeam(teamId)
        const recievers = [...deletedTeam.members, ...deletedTeam.requests]
        socket.emit('team-deleted', { id: teamId, recievers })
        history.push('/')
        props.hideForm()
    }

    const onBlur = () => {
        setTimeout(() => setAreMembersShown(false), 120)
    }

    const confirmationObjectFunctions = {
        'remove this member': removeMemberForInvite,
        'leave this team': removeTeamMember,
        'delete this member from team': removeTeamMember,
        'delete this member from invited': removeInvitation,
        'delete this team': handleDeleteTeam
    }

    return (
        <div>
            {
                isConfirmOpen &&
                <ConfirmDialog
                    title={confirmTitle}
                    hideConfirm={() => setIsConfirmOpen(false)}
                    onConfirm={() => confirmationObjectFunctions[confirmTitle](currElement)}
                />
            }
            <div className={styles.form}>
                <div className={styles.container}>
                    <div className={styles.title} >Team</div>
                    <div className={styles['input-container']}>
                        <span> Name</span>
                        <input
                            className={`${styles['input-name']} ${isAdmin ? '' : styles['input-disable']}`}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            label='Name'
                            id='name'
                        />
                    </div>
                
                    <div className={styles['input-container-descr']}>
                        <span> Description</span>
                        <textarea
                            className={`${styles['text-area-descr']} ${isAdmin ? '' : styles['input-disable']}`}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            label='Description'
                            id='description'
                            spellCheck='false'

                        />
                    </div>
                    {
                        isAdmin &&
                        <div className={styles['input-container-invite']}>
                            <span className={styles['text-invite']}> Invite Members</span>
                            <div className={styles['invite-input']}>
                                <input
                                    className={styles['input-invite']}
                                    autoComplete='off'
                                    value={member}
                                    onChange={inputMembers}
                                    label='Invite members'
                                    id='members'
                                    placeholder='username'
                                    onBlur={onBlur}
                                />
                                <div className={styles['select-for-invite']}>
                                    {
                                        areMembersShown &&
                                        <div className={styles.members}>
                                            {
                                                allUsers.filter(u => u.username.toLowerCase().includes(member.toLowerCase()) && !u.username.includes(user.username))
                                                    .filter((e) => {
                                                        const found = members.find(element => element.username === e.username)
                                                        if (found) {
                                                            return false
                                                        } else {
                                                            return true
                                                        }
                                                    })
                                                    .filter((e) => {
                                                        const found = invited.find(element => element.username === e.username)
                                                        if (found) {
                                                            return false
                                                        } else {
                                                            return true
                                                        }
                                                    })
                                                    .filter((e) => {
                                                        const found = forInvite.find(element => element.username === e.username)
                                                        if (found) {
                                                            return false
                                                        } else {
                                                            return true
                                                        }
                                                    })
                                                    .sort((a, b) => a.username.localeCompare(b.username))
                                                    .map((u, index) => {
                                                        return (
                                                            <ButtonClean
                                                                key={index}
                                                                className={styles.user}
                                                                onClick={() => addMember(u)}
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
                    }
                    {
                        isAdmin ?
                            <div className={styles['members-div']}>
                                <div className={styles['members-avatars']}>
                                    <span>
                                        <div>
                                            Send Invitation:
                                        </div>
                                        {
                                            forInvite.map((m, index) => {
                                                return (
                                                    <span key={index}>
                                                        <AvatarUser user={m}
                                                            size={40}
                                                            onClick={() => {
                                                                setIsConfirmOpen(true)
                                                                setConfirmTitle('remove this member')
                                                                setCurrElement(m)
                                                            }} />
                                                    </span>
                                                )
                                            })
                                        }
                                    </span>
                                </div>
                                <div>
                                    <div className={styles.membersAvatars}>
                                        <div>
                                            Team Members:
                                        </div>
                                        {
                                            members.map((m, index) => {
                                                return (
                                                    <span key={index}>
                                                        <AvatarUser user={m} size={40}
                                                            onClick={() => {
                                                                setIsConfirmOpen(true)
                                                                setConfirmTitle('delete this member from team')
                                                                setCurrElement(m)
                                                            }}
                                                        />
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                    {
                                        (invited.length !== 0) &&
                                        <div className={styles.membersAvatars}>
                                            <div>
                                                Invited Members:
                                            </div>
                                            {
                                                invited.map((m, index) => {
                                                    return (
                                                        <span key={index}>
                                                            <AvatarUser user={m}
                                                                size={40}
                                                                onClick={() => {
                                                                    setIsConfirmOpen(true)
                                                                    setConfirmTitle('delete this member from invited')
                                                                    setCurrElement(m)
                                                                }}
                                                            />
                                                        </span>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                                <div className={styles['button-div']}>
                                    <ButtonGrey
                                        className={styles['create-button']}
                                        onClick={() => handleSubmit()}
                                        title={'Submit Changes'}
                                    />
                                    <ButtonGrey
                                        className={styles['create-button']}
                                        title={'Delete Team'}
                                        onClick={() => {
                                            setIsConfirmOpen(true)
                                            setConfirmTitle('delete this team')
                                            setCurrElement('')
                                        }}
                                    />
                                </div>
                            </div>
                            :
                            <div>
                                <TeamMembers
                                    members={members} invited={invited}
                                />
                                {
                                    !props.isMessage &&
                                    <div className={styles['leave-team-btn-div']}>
                                        <ButtonGrey
                                            title={'Leave Team'}
                                            className={styles['leave-team-btn']}
                                            onClick={() => {
                                                setIsConfirmOpen(true)
                                                setConfirmTitle('leave this team')
                                                setCurrElement(user)
                                            }}
                                        />
                                    </div>
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

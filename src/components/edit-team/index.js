import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import TeamContext from '../../contexts/TeamContext'
import ButtonClean from '../button-clean'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import TeamMembers from '../team-members'
import ButtonGrey from '../button-grey'
import ConfirmDialog from '../confirmation-dialog'
import AvatarUser from '../avatar-user'


export default function EditTeam(props) {
    const [currTeam, setCurrTeam] = useState(props.currTeam)
    const [name, setName] = useState(currTeam.name)
    const [description, setDescription] = useState(currTeam.description)
    const [member, setMember] = useState('')
    const [members, setMembers] = useState(currTeam.members)
    const [invited, setInvited] = useState(currTeam.requests)
    const [forInvite, setForInvite] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmTitle, setConfirmTitle] = useState('')
    const [currElement, setCurrElement] = useState('')

    const history = useHistory()
    const teamContext = useContext(TeamContext)
    const userContext = useContext(UserContext)
    const socket = useSocket()
    const params = useParams()

    const teamId = params.teamid

    const getData = useCallback(() => {

        userContext.user.teams.forEach(t => {
            if (t._id === teamId) {
                setCurrTeam(t)
            }
        })
        let teamAuthor = currTeam.author
        setMembers(currTeam.members)
        setInvited(currTeam.requests)
        setDescription(currTeam.description)
        setName(currTeam.name)
        if (userContext.user.id === teamAuthor) {
            setIsAdmin(true)
        }
    }, [userContext.user.id, currTeam.author, currTeam.description, currTeam.members, currTeam.name, currTeam.requests, userContext.user.teams, teamId])


    useEffect(() => {
        getData()
    }, [getData])


    const inputMembers = async (event) => {
        setMember(event.target.value)
        setShowMembers(false)

        if (allUsers.length === 0) {
            const token = getCookie("x-auth-token")
            const response = await fetch('/api/user/get-all', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })

            if (!response.ok) {
                history.push("/error")
            }
            const users = await response.json()
            setAllUsers(users)
        }


        if (member.length >= 2) {
            setShowMembers(true)
        }
    }

    const addMember = (input) => {
        const arr = [...forInvite]
        arr.push(input)
        setForInvite(arr)
        setShowMembers(false)
        setMember('')
    }

    const removeMember = async (input) => {

        const arr = await members.filter(u => u._id !== input._id)
            .filter(u => u._id !== input.id)


        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/teams/${teamId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                members: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            socket.emit('team-update', teamId)
            if (input.id === userContext.user.id) {
                history.push("/")
            }
        }
    }

    const removeInvited = async (input) => {
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/teams/${teamId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                removeInvitation: input
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            getData()
            socket.emit('team-update', teamId)
            socket.emit('message-sent', input._id)
        }
    }

    const removeForInvite = (input) => {
        const arr = forInvite.filter(u => u._id !== input._id)
        setForInvite(arr)
    }

    const handleSubmit = async () => {
        // event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/teams/${teamId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                members,
                requests: forInvite
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            teamContext.setSelectedTeam(name)
            getData()
            socket.emit('team-update', teamId)
            socket.emit('multiple-messages-sent', forInvite)
            props.hideForm()
        }

    }

    async function deleteTeam() {

        if (!window.confirm('You will lost all team information - projects, lists and tasks')) {
            return
        }


        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/teams/${teamId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const deletedTeam = await response.json()
            const recievers = [...deletedTeam.members, ...deletedTeam.requests]
            socket.emit('team-deleted', { id: teamId, recievers })
            history.push("/")
            props.hideForm()
        }
    }

    const onBlur = () => {
        setTimeout(() => setShowMembers(false), 120)
    }

    let confirmationObjectFunctions = {
        'remove this member': removeForInvite,
        'leave this team': removeMember,
        'delete this member from team': removeMember,
        'delete this member from invited': removeInvited,
        'delete this team': deleteTeam
    }

    return (
        <div>
            {confirmOpen &&
                <ConfirmDialog
                    title={confirmTitle}
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={() => confirmationObjectFunctions[confirmTitle](currElement)}
                />
            }


            <div className={styles.form}>
                <div className={styles.container}>

                    <div className={styles.title} >Team</div>

                    <div className={styles['input-container']}>
                        <span> Name</span>
                        <input
                            className={styles['input-name']}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            label="Name"
                            id="name"
                        />
                    </div>

                    <div className={styles['input-container-descr']}>
                        <span> Description</span>
                        <textarea
                            className={styles['text-area-descr']}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            label="Description"
                            id="description"
                            spellCheck="false"

                        />
                    </div>
                    {
                        isAdmin ?
                            <div className={styles['input-container-invite']}>
                                <span className={styles['text-invite']}> Invite Members</span>

                                <div className={styles['invite-input']}>
                                    <input
                                        className={styles['input-invite']}
                                        autoComplete="off"
                                        value={member}
                                        onChange={inputMembers}
                                        label="Invite members"
                                        id="members"
                                        placeholder='username'
                                        onBlur={onBlur}

                                    />

                                    <div className={styles['select-for-invite']}>
                                        {
                                            showMembers ?
                                                <div className={styles.members}>
                                                    {
                                                        allUsers.filter(u => u.username.toLowerCase().includes(member.toLowerCase()) && !u.username.includes(userContext.user.username))
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
                                                </div> : null
                                        }
                                    </div>
                                </div>
                            </div>
                            : null
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
                                                            setConfirmOpen(true)
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
                                                    <AvatarUser user={m}  size={40}
                                                        onClick={() => {
                                                            setConfirmOpen(true)
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
                                        (invited.length !== 0) ?

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
                                                                    setConfirmOpen(true)
                                                                    setConfirmTitle('delete this member from invited')
                                                                    setCurrElement(m)
                                                                }}
                                                            />
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </div>
                                            :
                                            null
                                    }
                                </div>

                                <div className={styles['button-div']}>
                                    <ButtonGrey className={styles['create-button']} onClick={() => handleSubmit()} title={'Submit Changes'} />
                                    <ButtonGrey className={styles['create-button']} title={'Delete Team'}
                                        onClick={() => {
                                            setConfirmOpen(true)
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

                                { !props.isMessage && <div className={styles['leave-team-btn-div']}>
                                    <ButtonGrey title={'Leave Team'} className={styles['leave-team-btn']}
                                        onClick={() => {
                                            setConfirmOpen(true)
                                            setConfirmTitle('leave this team')
                                            setCurrElement(userContext.user)
                                        }}

                                    />

                                </div>}
                            </div>
                    }



                </div>
            </div>

        </div>
    )
}

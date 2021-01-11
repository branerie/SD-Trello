import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import TeamContext from '../../contexts/TeamContext'
import Avatar from 'react-avatar'
import ButtonClean from '../button-clean'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import TeamMembers from '../team-members'

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
    const context = useContext(UserContext)
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
        if (context.user.id === teamAuthor) {
            setIsAdmin(true)
        }
    }, [context.user.id, currTeam.author, currTeam.description, currTeam.members, currTeam.name, currTeam.requests, userContext.user.teams, teamId])


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
            // getData()
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
                name,
                description,
                removeInvitation: input
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            // getData()
        }
    }

    const removeForInvite = (input) => {
        const arr = forInvite.filter(u => u._id !== input._id)
        setForInvite(arr)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
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
            props.hideForm()
        }

    }

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>

                <div className={styles.title} >Team</div>

                <div className={styles.inputContainer}>
                    <span> Name</span>
                    <input
                        className={styles.input}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        label="Name"
                        id="name"
                    />
                </div>

                <div className={styles.inputContainerDescr}>
                    <span> Description</span>
                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        label="Description"
                        id="description"
                    />
                </div>
                {
                    isAdmin ?
                        <div>
                            <div className={styles.inputContainer}>
                                <span> Invite Members</span>
                                <input
                                    className={styles.input}
                                    autocomplete="off"
                                    value={member}
                                    onChange={inputMembers}
                                    label="Invite members"
                                    id="members"
                                    placeholder='username'
                                />
                            </div>

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
                            <div className={styles.membersAvatars}>
                                <span>
                                    <div>
                                        Send Invitation:
                                </div>
                                    {
                                        forInvite.map((m, index) => {
                                            return (
                                                <Avatar
                                                    key={index}
                                                    name={m.username}
                                                    size={40} round={true} maxInitials={2}
                                                    onClick={() => { if (window.confirm('Are you sure you wish to delete this member?')) removeForInvite(m) }}
                                                />

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
                                                <ButtonClean key={index}
                                                    onClick={() => { if (window.confirm('Are you sure you wish to delete this member?')) removeMember(m) }}
                                                    title={<Avatar key={m._id} name={m.username} size={40} round={true} maxInitials={2} />}
                                                />

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
                                                        <Avatar
                                                            key={index}
                                                            name={m.username}
                                                            size={40} round={true} maxInitials={2}
                                                            onClick={() => { if (window.confirm('Are you sure you wish to delete this member?')) removeInvited(m) }}
                                                        />

                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        null
                                }
                            </div>

                            <div className={styles.buttonDiv}>
                                <button type='submit' className={styles.createButton}>Submit Changes</button>
                            </div>
                        </div>
                        :
                        <div>
                            <TeamMembers
                                members={members} invited={invited}
                            />
                        </div>
                }



            </form>
        </div>
    )
}

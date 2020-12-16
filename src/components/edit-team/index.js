import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
// import "react-datepicker/dist/react-datepicker.css"
import TeamContext from '../../contexts/TeamContext'
import Avatar from 'react-avatar'
import ButtonClean from '../button-clean'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'

export default function EditTeam(props) {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [member, setMember] = useState('')
    const [members, setMembers] = useState([])
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



    const getData = useCallback(async () => {


        let currTeam = {}
        await teamContext.teams.map(t => {
            if (t._id === teamId) {
                currTeam = t
            }
        })
        let teamAthor = currTeam.author



        const token = getCookie("x-auth-token");

        const response = await fetch(`/api/teams/get-users/${teamId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const data = await response.json()
            setMembers(data)
            setDescription(currTeam.description)
            setName(currTeam.name)
            if (context.user.id === teamAthor) {
                setIsAdmin(true)
            }
        }



    }, [])


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
        const arr = [...members]
        arr.push(input)
        setMembers(arr)
        setShowMembers(false)
        setMember('')
    }

    const removeMember = (input) => {
        const arr = members.filter(u => u._id !== input._id)
        setMembers(arr)
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
                members
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            teamContext.setSelectedTeam(name)
            getData()
            props.hideForm()
            socket.emit('team-update', teamId)
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
                                                .sort((a, b) => a.username.localeCompare(b.username))
                                                .map(u => {
                                                    return (
                                                        <ButtonClean
                                                            key={u._id}
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
                                {
                                    members.map((m, index) => {
                                        return (
                                            <Avatar
                                                key={index}
                                                name={m.username}
                                                size={40} round={true} maxInitials={2}
                                                onClick={() => { if (window.confirm('Are you sure you wish to delete this member?')) removeMember(m) }}
                                            />

                                        )
                                    })
                                }
                            </div>

                            <div className={styles.buttonDiv}>
                                <button type='submit' className={styles.createButton}>Submit Changes</button>
                            </div>
                        </div>
                        :
                        <div className={styles.membersAvatars}>
                            {
                                members.map(m => {
                                    return (
                                        <ButtonClean
                                            title={<Avatar key={m._id} name={m.username} size={40} round={true} maxInitials={2} />}
                                        />

                                    )
                                })
                            }
                        </div>
                }



            </form>
        </div>
    )
}

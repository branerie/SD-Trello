import React, { useContext, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import TeamContext from '../../contexts/TeamContext'
import Avatar from 'react-avatar'
import ButtonClean from '../button-clean'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'

export default function CreateTeam(props) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [member, setMember] = useState('')
    const [members, setMembers] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const history = useHistory()
    const teamContext = useContext(TeamContext)
    const userContext = useContext(UserContext)
    const socket = useSocket()

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
        const arr = members.filter(u => u.email !== input.email)
        setMembers(arr)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch('/api/teams', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                requests: members
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const team = await response.json()
            const arr = [...teamContext.teams]
            arr.push(team)
            teamContext.setTeams(arr)
            teamContext.setSelectedTeam(team.name)
            props.hideForm()
            socket.emit('team-update', team._id)
            history.push(`/team/${team._id}`)
        }

    }

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>

                <div className={styles.title} >Create New Team</div>

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
                        members.map(m => {
                            return (
                                <ButtonClean
                                    onClick={() => removeMember(m)}
                                    title={<Avatar key={m._id} name={m.username} size={40} round={true} maxInitials={2} />}
                                />

                            )
                        })
                    }
                </div>

                <div className={styles.buttonDiv}>
                    <button type='submit' className={styles.createButton}>Create</button>
                </div>


            </form>
        </div>
    )
}

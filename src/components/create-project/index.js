import React, { useState, useContext } from 'react'
import { useHistory, useParams } from "react-router-dom"
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import ButtonClean from '../button-clean'
import Avatar from 'react-avatar'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'

export default function CreateProject({ hideForm }) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [member, setMember] = useState('')
    const [members, setMembers] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const userContext = useContext(UserContext)
    const history = useHistory()
    const params = useParams()
    const socket = useSocket()

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (name === '') {
            return
        }

        const teamId = params.teamid
        const token = getCookie("x-auth-token")
        const response = await fetch('/api/projects', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                teamId
            })
        })
        if (!response.ok) {
            history.push('/error')
            return
        } else {
            const project = await response.json()
            hideForm && hideForm()
            socket.emit('team-update', teamId)
            history.push(`/project-board/${teamId}/${project._id}`)
        }
    }

    const onFocus = async () => {
        setShowMembers(true)

        const teamId = params.teamid

        if (allUsers.length === 0) {
            const token = getCookie("x-auth-token")
            const response = await fetch(`/api/teams/get-users/${teamId}`, {
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
            setAllUsers(users.members)
        }
    }

    const onBlur = () => {
        setTimeout(() => setShowMembers(false), 120)
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

    return (
        // <div className={styles.form}>
        <form className={styles.container} onSubmit={handleSubmit}>



            <div className={styles.title} >Create New Project</div>

            <div className={styles.inputContainer}>
                <span> Name</span>
                <input
                    className={styles.inputName}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Name"
                    id="name"
                    placeholder='Project Name'
                />
            </div>

            <div className={styles.inputContainerDescr}>
                <span> Description</span>
                <textarea
                    className={styles.textareaDescr}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    label="Description"
                    id="description"
                    placeholder='Project Description'

                />
            </div>

            <div className={styles.inputContainer}>
                <span className={styles.textInvite}> Invite Members</span>

                <div className={styles.inviteInput}>
                    <input
                        className={styles.membersInput}
                        autoComplete="off"
                        value={member}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(e) => setMember(e.target.value)}
                        label="Invite members"
                        id="members"
                        placeholder='Teammate Username'
                    />

                    <div className={styles.selectForInvite}>
                        {
                            showMembers &&
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
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className={styles.membersAvatars}>
                {
                    members.map(m => {
                        return (
                            <Avatar onClick={() => removeMember(m)} key={m._id} name={m.username} size={40} round={true} maxInitials={2} />
                        )
                    })
                }
            </div>

            <div className={styles.buttonDiv}>
                <button type='submit' className={styles.createButton}>Create</button>
            </div>

        </form>
        // </div>
    )
}

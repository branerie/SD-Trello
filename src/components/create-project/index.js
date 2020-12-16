import React, { useCallback, useState, useContext } from 'react'
import { useHistory, useParams } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import ProjectContext from '../../contexts/ProjectContext'
import ButtonClean from '../button-clean'
import Avatar from 'react-avatar'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import TeamContext from '../../contexts/TeamContext'

export default function CreateProject({ hideForm }) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [member, setMember] = useState('')
    const [members, setMembers] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const projectContext = useContext(ProjectContext)
    const userContext = useContext(UserContext)
    const teamContext = useContext(TeamContext)
    const history = useHistory()
    const params = useParams()
    const socket = useSocket()

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
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
            projectContext.setProject(project._id)
            socket.emit('team-update', teamContext.currentTeam)
            history.push(`/project-board/${teamId}/${project._id}`)
            hideForm && hideForm()
        }
    }, [history, name, description])

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
            setAllUsers(users)

            
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
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>

                <div className={styles.title} >Create New Project</div>

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
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(e) => setMember(e.target.value)}
                        label="Invite members"
                        id="members"
                        placeholder='username'
                    />
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



                {
                    showMembers ? <div className={styles.members}>
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
                                            title={<div className={styles.member}>
                                                <div>{u.username}</div>
                                                <div className={styles.email}>{u.email}</div>
                                            </div>}
                                        />)
                                })
                        }
                    </div> : null
                }

                <div className={styles.buttonDiv}>
                    <button type='submit' className={styles.createButton}>Create</button>
                </div>

            </form>
        </div>
    )
}

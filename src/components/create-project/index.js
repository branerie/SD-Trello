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

export default function CreateProject() {
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

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Create Project" />
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Name"
                    id="name"
                />
                <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    label="Description"
                    id="description"
                />
                <Input
                    value={member}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={(e) => setMember(e.target.value)}
                    label="Invite members"
                    id="members"
                    placeholder='username'
                />
                <Button title="Create" />
                <div>
                    {
                        members.map(m => {
                            return (
                                <Avatar key={m._id} name={m.username} size={40} round={true} maxInitials={2} />
                            )
                        })
                    }
                </div>
            </form>
            {
                showMembers ? <div className={styles.members}>
                    {
                        allUsers.filter(u => u.username.toLowerCase().includes(member.toLowerCase()) && !u.username.includes(userContext.user.username))
                                .sort((a,b) => a.username.localeCompare(b.username))
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
        </div>
    )
}

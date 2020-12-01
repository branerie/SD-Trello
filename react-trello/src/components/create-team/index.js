import React, { useCallback, useContext, useState } from 'react'
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

    const inputMembers = async (event) => {
        setMember(event.target.value)
        setShowMembers(false)

        if (allUsers.length === 0) {
            const token = getCookie("x-auth-token")
            const response = await fetch('http://localhost:4000/api/user/get-all', {
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
        console.log(arr);
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
        console.log(members);
        const response = await fetch('http://localhost:4000/api/teams', {
            method: "POST",
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
            const team = await response.json()
            const arr = [...teamContext.teams]
            arr.push(team)
            teamContext.setTeams(arr)

            props.setOption(team._id)
            props.hideForm()
        }

    }

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Create Team" />
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
                    onChange={inputMembers}
                    label="Invite members"
                    id="members"
                    placeholder='username'
                />
                <Button title="Create" />
                <div>
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

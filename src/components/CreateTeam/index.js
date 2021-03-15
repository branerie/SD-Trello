import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './index.module.css'
import TeamContext from '../../contexts/TeamContext'
import ButtonClean from '../ButtonClean'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import AvatarUser from '../AvatarUser'
import ButtonGrey from '../ButtonGrey'
import useUserServices from '../../services/useUserServices'
import useTeamServices from '../../services/useTeamServices'


export default function CreateTeam(props) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [member, setMember] = useState('')
    const [members, setMembers] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const history = useHistory()
    const teamContext = useContext(TeamContext)
    const userContext = useContext(UserContext)
    const socket = useSocket()
    const { getAllUsers } = useUserServices()
    const { createTeam } = useTeamServices()



    const inputMembers = async (event) => {
        setMember(event.target.value)
        setShowMembers(false)

        if (allUsers.length === 0) {
            const users = await getAllUsers()
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

        if (name === '') {
            return
        }    
        const team = await createTeam(name, description, members)
        const arr = [...teamContext.teams]
        arr.push(team)        
        teamContext.setTeams(arr)
        teamContext.setSelectedTeam(team.name)
        props.hideForm()
        socket.emit('team-update', team._id)
        socket.emit('multiple-messages-sent', members)
        history.push(`/team/${team._id}`)
    }

    const onBlur = () => {
        setTimeout(() => setShowMembers(false), 120)
    }

    return (
        <div className={styles.container}>


            <div className={styles.title} >Create New Team</div>

            <div className={styles['input-container']}>
                <span> Name</span>
                <input
                    className={styles['input-name']}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label='Name'
                    id='name'
                    placeholder='Team Name'
                    autoComplete='off'
                />
            </div>

            <div className={styles['input-container-descr']}>
                <span className={styles['description-text']}> Description</span>
                <textarea
                    className={styles['text-area-descr']}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    label='Description'
                    id='description'
                    placeholder='Team Description'
                    spellCheck='false'
                />
            </div>

            <div className={styles['input-container-members']}>
                <span className={styles['members-text']}> Invite Members</span>

                <div className={styles['invite-input']}>
                    <input
                        className={styles['input-members']}
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
                            showMembers &&
                            <div className={styles['members-pop-up']}>
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
                            </div>
                        }
                    </div>
                </div>
            </div>


            <div className={styles['members-avatars']}>
                {
                    members.map(m => {
                        return (
                            <ButtonClean
                                onClick={() => removeMember(m)}
                                title={
                                    <AvatarUser user={m} size={40} />
                                }
                            />

                        )
                    })
                }
            </div>

            <div className={styles['button-div']}>
                <ButtonGrey onClick={(e) => handleSubmit(e)} title='Create' className={styles['create-button']} />
            </div>


        </div>
    )
}

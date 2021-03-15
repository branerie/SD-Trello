import React, { useState, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import AvatarUser from '../AvatarUser'
import ButtonGrey from '../ButtonGrey'
import useProjectsServices from '../../services/useProjectsServices'
import useTeamServices from '../../services/useTeamServices'

export default function CreateProject({ hideForm }) {
    const history = useHistory()
    const socket = useSocket()
    const { teamId } = useParams()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [member, setMember] = useState('')
    const [members, setMembers] = useState([])
    const [areMembersShown, setAreMembersShown] = useState(false)
    const [allTeamMembers, setAllTeamMembers] = useState([])
    const { user } = useContext(UserContext)
    const { createProject } = useProjectsServices()
    const { getTeamUsers } = useTeamServices()


    const handleCreateProject = async (event) => {
        event.preventDefault()
        if (name === '') {
            return
        }
        const project = await createProject(name, description, teamId, members)
        hideForm && hideForm()
        socket.emit('team-update', teamId)
        history.push(`/project-board/${teamId}/${project._id}`)
    }

    const onFocus = async () => {
        setAreMembersShown(true)
        if (allTeamMembers.length === 0) {
            const users = await getTeamUsers(teamId)
            setAllTeamMembers(users.members)
        }
    }

    const onBlur = () => {
        setTimeout(() => setAreMembersShown(false), 120)
    }

    const addMember = (input) => {
        const membersArray = [...members]
        membersArray.push(input)
        setMembers(membersArray)
        setAreMembersShown(false)
        setMember('')
    }

    const removeMember = (input) => {
        const membersArray = members.filter(member => member._id !== input._id)
        setMembers(membersArray)
    }

    return (
        <div className={styles.container} >
            <div className={styles.title} >Create New Project</div>
            <div className={styles['input-container']}>
                <span> Name</span>
                <input
                    className={styles['input-name']}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label='Name'
                    id='name'
                    placeholder='Project Name'
                    autoComplete='off'
                />
            </div>

            <div className={styles['input-container-descr']}>
                <span> Description</span>
                <textarea
                    className={styles['text-area-descr']}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    label='Description'
                    id='description'
                    placeholder='Project Description'
                    spellCheck='false'
                />
            </div>

            <div className={styles['input-container']}>
                <span className={styles['text-invite']}>Add Members</span>
                <div className={styles['invite-input']}>
                    <input
                        className={styles['members-input']}
                        autoComplete='off'
                        value={member}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(e) => setMember(e.target.value)}
                        label='Invite members'
                        id='members'
                        placeholder='Teammate Username'
                    />

                    <div className={styles['select-for-invite']}>
                        {
                            areMembersShown &&
                            <div className={styles.members}>
                                {
                                    allTeamMembers.filter(u => u.username.toLowerCase().includes(member.toLowerCase()) && !u.username.includes(user.username))
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

            <div className={styles['members-avatars']}>
                {
                    members.map((member, index) => {
                        return (
                            <span key={index}>
                                <AvatarUser user={member} onClick={() => removeMember(member)} size={40} />
                            </span>
                        )
                    })
                }
            </div>

            <div className={styles['button-div']}>
                <ButtonGrey
                    title='Create'
                    className={styles['create-button']}
                    onClick={(e) => handleCreateProject(e)}
                />
            </div>

        </div>
    )
}

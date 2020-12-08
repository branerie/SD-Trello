import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import { useSocket } from '../../contexts/SocketProvider'
import Transparent from '../transparent'
import AddProjectMember from '../add-project-member'
import Avatar from 'react-avatar'
import UserContext from '../../contexts/UserContext'


export default function EditProject(props) {
    const [name, setName] = useState(props.project.name)
    const [isAdmin, setIsAdmin] = useState(false)
    const [description, setDescription] = useState(props.project.description)
    const members = props.project.membersRoles
    const [IsVisibleAdd, setIsVisibleAdd] = useState(false)
    const context = useContext(UserContext)
    const history = useHistory()
    const socket = useSocket()

    const projectId = props.project._id

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


    useEffect(() => {
        const admins = members.filter(a => a.admin === true)
        if (admins.some(item => item.memberId._id === context.user.id)) {
            setIsAdmin(true)
        }
    })



    async function handleSubmit(event) {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/${projectId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
            props.hideForm()
        }
    }

    const showFormAdd = () => {
        setIsVisibleAdd(true)
    }

    const hideFormAdd = () => {
        setIsVisibleAdd(false)
    }

    return (
        <div className={styles.form}>
            <form className={styles.container} >
                <Title title="Edit Project" />
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
                <div className={styles.editMembers}>
                    <div>Team: </div>

                        Admins :{members.filter(a => a.admin === true).map((element, index) => {
                        return (
                            <span className={styles.membersList} key={index}>
                                <Avatar name={element.memberId.username} size={30} round={true} maxInitials={2} />
                            </span>
                        )
                    }
                    )}
                    <div>
                        Members :{members.filter(a => a.admin === false).map((element, index) => {
                        return (
                            <span className={styles.membersList} key={index}>
                                <Avatar name={element.memberId.username} size={30} round={true} maxInitials={2} />
                            </span>
                        )
                    }
                    )}
                    </div>
                </div>
            </form>
            <div className={styles.editMembers}>
                {isAdmin ?
                    <div>
                        <Button onClick={showFormAdd} title="Edit members" className={styles.editMembersButton} />
                        {IsVisibleAdd ?
                            < div >
                                <Transparent hideFormAdd={hideFormAdd} >
                                    <AddProjectMember hideFormAdd={hideFormAdd} project={props.project} members={props.project.membersRoles} />
                                </Transparent >
                            </div > : null
                        }
                        <Button onClick={handleSubmit} title="Edit" />
                    </div>
                    : null
                }
            </div>
        </div>

    )
}
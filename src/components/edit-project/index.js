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
    const [description, setDescription] = useState(props.project.description)
    const members = props.project.membersRoles
    const [IsVisibleAdd, setIsVisibleAdd] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const context = useContext(UserContext)
    const history = useHistory()
    const socket = useSocket()

    const projectId = props.project._id

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


    async function getData() {
        const admins = await members.filter(a => a.admin === true)
        if (admins.some(item => item.memberId._id === context.user.id)) {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    }

    useEffect(() => {
        getData()       
    }, [getData])



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



    return (
        <div className={styles.form}>
            <form className={styles.container} >
                <Title title="Project" />
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
                    <AddProjectMember admin={isAdmin} project={props.project} members={props.project.membersRoles} />
                </div>
            </form>
            <div className={styles.editMembers}>
                {isAdmin ?
                    <Button onClick={handleSubmit} title="Edit" />
                    : null
                }
            </div>
        </div>

    )
}
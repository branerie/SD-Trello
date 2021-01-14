import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import { useSocket } from '../../contexts/SocketProvider'
import AddProjectMember from '../add-project-member'
import UserContext from '../../contexts/UserContext'
import isUserAdmin from '../../utils/isUserAdmin'


export default function EditProject(props) {
    const [name, setName] = useState(props.project.name)
    const [description, setDescription] = useState(props.project.description)
    const members = props.project.membersRoles
    const [isAdmin, setIsAdmin] = useState(false)
    const userContext = useContext(UserContext)
    const history = useHistory()
    const socket = useSocket()
    const params = useParams()


    const projectId = props.project._id

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])

    useEffect(() => {
        setIsAdmin(isUserAdmin(userContext.user.id, members))
    }, [members, userContext.user.id])



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

    async function deleteProject() {
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/${props.project._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            socket.emit('team-update', params.teamid)
            history.push('/')
        }
    }

    return (
        <div className={styles.form}>
            <form className={styles.container} >
            <div className={styles.title} >Project</div>
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
                <div className={styles.editMembers}>
                    <AddProjectMember admin={isAdmin} project={props.project} members={props.project.membersRoles} />
                </div>
            </form>
            <div>
                {isAdmin ?
                    <div className={styles.buttonsDiv}>
                        <button className={styles.navigateButtons} onClick={handleSubmit}  >Edit</button>
                        <button className={styles.navigateButtons} onClick={() => { if (window.confirm('Are you sure you wish to delete this project?')) deleteProject() }}  >Delete Project</button>
                    </div>
                    : null
                }
            </div>
        </div>
    )
}
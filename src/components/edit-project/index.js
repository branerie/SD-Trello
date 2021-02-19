import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import { useSocket } from '../../contexts/SocketProvider'
import AddProjectMember from '../add-project-member'
import UserContext from '../../contexts/UserContext'
import isUserAdmin from '../../utils/isUserAdmin'
import ButtonGrey from '../button-grey'
import ConfirmDialog from '../confirmation-dialog'


export default function EditProject(props) {
    const [name, setName] = useState(props.project.name)
    const [description, setDescription] = useState(props.project.description)
    const members = props.project.membersRoles
    const [isAdmin, setIsAdmin] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

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
    }, [members, userContext.user.id, props])



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
            socket.emit('team-update', params.teamid)
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
            props.hideForm()
            const obj = {
                projectId: props.project._id,
                teamId: params.teamid
            }
            socket.emit('project-deleted', obj)
            history.push(`/team/${params.teamid}`)
        }
    }

    return (
        <div className={styles.form}>
            {confirmOpen &&
                <ConfirmDialog
                    title={'delete this project'}
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={() => deleteProject()}
                />
            }

            <div className={styles.container} >
                <div className={styles.title} >Project</div>
                
                <div className={styles['input-container']}>
                    <span> Name</span>
                    <input
                        className={styles['input-pr-name']}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        label="Name"
                        id="name"
                    />
                </div>
                <div className={styles['input-container-descr']}>
                    <span> Description</span>
                    <textarea
                        className={styles['text-area-descr']}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        label="Description"
                        id="description"
                        placeholder='Project Description'
                    />
                </div>
                <div className={styles['edit-members']}>
                    <AddProjectMember admin={isAdmin} project={props.project} members={props.project.membersRoles} />
                </div>
            </div>
            <div>
                {isAdmin ?
                    <div className={styles['buttons-div']}>
                        <ButtonGrey className={styles['navigate-buttons']} title={'Edit'} onClick={handleSubmit}/>
                        <ButtonGrey className={styles['navigate-buttons']} title={'Delete Project'} 
                        onClick={() => {
                            setConfirmOpen(true)                            
                        }}
                        />
                    </div>
                    : null
                }
            </div>
        </div>
    )
}
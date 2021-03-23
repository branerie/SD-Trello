import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './index.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useSocket } from '../../contexts/SocketProvider'
import AddProjectMember from '../AddProjectMember'
import UserContext from '../../contexts/UserContext'
import checkIsUserAdmin from '../../utils/checkIsUserAdmin'
import ButtonGrey from '../ButtonGrey'
import ConfirmDialog from '../ConfirmationDialog'
import useProjectsServices from '../../services/useProjectsServices'


export default function EditProject(props) {
    const [name, setName] = useState(props.project.name)
    const [description, setDescription] = useState(props.project.description)
    const [isFinished, setIsFinished] = useState(props.project.isFinished)
    const members = props.project.membersRoles
    const [isAdmin, setIsAdmin] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const userContext = useContext(UserContext)
    const history = useHistory()
    const socket = useSocket()
    const params = useParams()
    const { editProject, deleteProject } = useProjectsServices()

    const projectId = props.project._id

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props])

    useEffect(() => {
        setIsAdmin(checkIsUserAdmin(userContext.user.id, members))
    }, [members, userContext.user.id, props])

    async function handleSubmit() {
        await editProject(projectId, name, description, isFinished)
        updateProjectSocket()
        props.hideForm()
        socket.emit('team-update', params.teamid)
    }

    async function handleDeleteProject() {
        await deleteProject(projectId)
        props.hideForm()
        const deletedProject = {
            projectId: props.project._id,
            teamId: params.teamid
        }
        socket.emit('project-deleted', deletedProject)
        history.push(`/team/${params.teamid}`)
    }

    return (
        <div className={styles.form}>
            {confirmOpen &&
                <ConfirmDialog
                    title={'delete this project'}
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={() => handleDeleteProject()}
                />
            }

            <div className={styles.container} >
                <div className={styles.title} >Project</div>

                <div className={styles['input-container']}>
                    <span> Name</span>
                    <input
                        className={`${styles['input-pr-name']} ${isAdmin ? '' : styles['input-disable']}`}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        label='Name'
                        id='name'
                    />
                </div>
                <div className={styles['input-container-descr']}>
                    <span> Description</span>
                    <textarea
                        className={`${styles['text-area-descr']} ${isAdmin ? '' : styles['input-disable']}`}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        label='Description'
                        id='description'
                        placeholder='Project Description'
                        spellCheck='false'
                    />
                </div>
                <div className={styles['edit-members']}>
                    <AddProjectMember admin={isAdmin} project={props.project} members={members} />
                </div>
            </div>
            <div>
                {isAdmin ?
                    <div className={styles['buttons-div']}>
                        <ButtonGrey className={styles['navigate-buttons']} title={'Edit'} onClick={handleSubmit} />
                        <ButtonGrey className={styles['navigate-buttons']}
                            title={isFinished ?
                                'Set Current' : 'Set Finished'}
                            onClick={() => setIsFinished(!isFinished)} />
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
import React, { useCallback, useContext, useRef, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Title from '../title'
import styles from './index.module.css'
import Avatar from 'react-avatar'
import getCookie from '../../utils/cookie'
import { useSocket } from '../../contexts/SocketProvider'
import TeamContext from "../../contexts/TeamContext"
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import UserContext from '../../contexts/UserContext'
import pen from '../../images/pen.svg'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'






export default function AddMember(props) {

    const socket = useSocket()
    const members = props.members
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const context = useContext(UserContext)
    const [admin, setAdmin] = useState(false)
    const teamContext = useContext(TeamContext)
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)

    const isAdmin = props.admin

    const history = useHistory()
    const projectId = props.project._id


    const cancelAdd = () => {
        props.hideFormAdd()
    }

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


    const getTeamUsers = async () => {
        let currentTeamId = ''

        await teamContext.teams.map(t => {
            return (
                t.projects.map(p => {
                    if (p._id === projectId) {
                        currentTeamId = t._id
                    }
                    return currentTeamId
                })
            )
        })

        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/teams/get-users/${currentTeamId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        if (!response.ok) {
            history.push("/error")
        }
        const data = await response.json()



        const filtered = data.filter((e) => {
            const found = members.find(element => element.memberId.username === e.username)
            if (found) {
                return false
            } else {
                return true
            }
        })

        setUsers(filtered)

    }

    async function handleOnDragEnd(result) {

        console.log(result);

        if (!result.destination) {
            console.log('no destination');
            return
        }

        const memberRoleId = result.draggableId

        const member = members.filter(a => a._id === memberRoleId)[0]['memberId']

        if (member._id === context.user.id) {
            console.log('can`t move self');
            return
        }

        const memberAdmin = members.filter(a => a._id === memberRoleId)[0]['admin']


        if (result.destination.droppableId === 'admins' && memberAdmin) {
            return
        }
        if (result.destination.droppableId === 'members' && !memberAdmin) {
            return
        }

        if (!memberAdmin) {
            if (!window.confirm(`Are you sure you wish to make ${member.username} admin ?`))
                return
        }

        if (memberAdmin) {
            if (!window.confirm(`Are you sure you wish to remove ${member.username} from  admins ?`))
                return
        }




        const token = getCookie("x-auth-token")

        const response = await fetch(`/api/projects/${projectId}/user-roles`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                userRole: memberRoleId,
                isAdmin: !memberAdmin
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
        }


    }

    const handleSelect = (id) => {
        const result = users.filter(obj => {
            return obj._id === id
        })[0]
        setSelectedUser(result)
    }

    const deleteMember = useCallback(async (event, member) => {
        event.preventDefault()
        const projectId = props.project._id

        if (member._id === context.user.id) {
            return
        }
        const memberId = member._id
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/${projectId}/user-remove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                memberId
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
        }

    }, [history, props, updateProjectSocket])


    const handleAdd = useCallback(async (event) => {
        event.preventDefault()

        const token = getCookie("x-auth-token")

        const member = selectedUser

        const response = await fetch(`/api/projects/${projectId}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                member,
                admin: false
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
            setIsActive(!isActive)
        }

    }, [history, props, selectedUser, admin, updateProjectSocket])

    return (
        <div className={styles.container}>


            <div className={styles.bigContainer} ref={dropdownRef}>
                {isAdmin ?
                    <span>
                        {isActive ?
                            <div className={styles.members}>
                                <div>
                                    Add Member to Project
                                </div>
                                <span>
                                    <select
                                        onChange={(e) => { handleSelect(e.target.value) }}>
                                        <option >Select user</option>
                                        {
                                            users.map((element) => (
                                                <option key={element._id} value={element._id}>{element.username}</option>
                                            ))
                                        }
                                    </select>
                                </span>
                                <span className={styles.addButton} onClick={handleAdd} >Add</span>
                            </div>
                            :
                            <DragDropContext onDragEnd={handleOnDragEnd}>


                                <div className={styles.adminsContainer}>
                                    <span className={styles.title}>Admins:</span>
                                    <Droppable droppableId={"admins"}>
                                        {(provided) => (
                                            <div className={styles.droppable} ref={provided.innerRef}  {...provided.droppableProps} >
                                                {
                                                    members.filter(a => a.admin === true).map((element, index) => {
                                                        return (
                                                            <Draggable key={element.memberId._id} draggableId={element._id} index={index}>
                                                                {(provided) => (
                                                                    <span {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                                        <Avatar name={element.memberId.username} size={40} round={true} maxInitials={2} />
                                                                        {provided.placeholder}
                                                                    </span>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    })
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>



                                <div className={styles.membersContainer}>
                                    <span className={styles.title}>Members:</span>
                                    <Droppable droppableId={"members"}>
                                        {(provided) => (
                                            <div className={styles.droppableMembers} ref={provided.innerRef} {...provided.droppableProps}>
                                                {
                                                    members.filter(a => a.admin !== true).map((element, index) => {
                                                        return (
                                                            <Draggable key={element.memberId._id} draggableId={element._id} index={index} >
                                                                {(provided) => (

                                                                    <span {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                                        <Avatar key={index} name={element.memberId.username} size={40} round={true} maxInitials={2}
                                                                            onClick={(e) => { if (window.confirm('Are you sure you wish to delete this member?')) deleteMember(e, element.memberId) }} />
                                                                        {provided.placeholder}
                                                                    </span>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    })
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    <span className={styles.addButton} onClick={() => { setIsActive(!isActive); getTeamUsers() }} >Add</span>
                                </div>


                            </DragDropContext>
                        }
                    </span >
                    :
                    <div>
                        <div className={styles.adminsContainer}>
                            <span className={styles.title}>Admins:</span>
                            <div className={styles.droppable}>
                                {
                                    members.filter(a => a.admin === true).map((element, index) => {
                                        return (
                                            <span key={index} >
                                                <Avatar name={element.memberId.username} size={40} round={true} maxInitials={2} />
                                            </span>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className={styles.adminsContainer}>
                            <span className={styles.title}>Members:</span>
                            <div className={styles.droppable}>

                                {
                                    members.filter(a => a.admin !== true).map((element, index) => {
                                        return (
                                            <span key={index} >
                                                <Avatar name={element.memberId.username} size={40} round={true} maxInitials={2} />
                                            </span>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    </div>
                }
            </div>
        </div>
    )
}

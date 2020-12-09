import React, { useCallback, useContext, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useSocket } from '../../contexts/SocketProvider'
import TeamContext from "../../contexts/TeamContext"




export default function AddMember(props) {

    const socket = useSocket()
    const members = props.members
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const [admin, setAdmin] = useState(false)
    const teamContext = useContext(TeamContext)

    const history = useHistory()
    const projectId = props.project._id
    // const projectId = props.project._id

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



    // const getAllUser = async () => {
    //     const token = getCookie("x-auth-token")
    //     const response = await fetch('/api/user/get-all', {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": token
    //         }
    //     })

    //     if (!response.ok) {
    //         history.push("/error")
    //     }
    //     const allUsers = await response.json()


    //     const filtered = allUsers.filter((e) => {
    //         const found = members.find(element => element.memberId.username === e.username)
    //         if (found) {
    //             return false
    //         } else {
    //             return true
    //         }
    //     })

    //     setUsers(filtered)
    // }

    const handleSelect = (id) => {
        const result = users.filter(obj => {
            return obj._id === id
        })[0]
        setSelectedUser(result)
    }

    const deleteMember = useCallback(async (event, member) => {
        event.preventDefault()
        const projectId = props.project._id
        
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
            props.hideFormAdd()
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
                admin: admin
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
            props.hideFormAdd()
        }

    }, [history, props, selectedUser, admin, updateProjectSocket])

    return (
        <div className={styles.form}>
            <div className={styles['current-members']}>
                <Title title={"Team members"} />
                {
                    members.map((element, index) => {
                        return (
                            // <Avatar key={index} name={element.memberId.username} size={40} round={true} maxInitials={2} onClick={(e) => { if (window.confirm('Are you sure you wish to delete this member?')) deleteMember(e, element)}} />

                            
                            <Button key={index} onClick={(e) => { if (window.confirm('Are you sure you wish to delete this member?')) deleteMember(e, element.memberId)}}  title={element.memberId.username}/>
                            
                            )
                    })
                }
            </div>
            <div>
                <div className={styles.container} >
                    <div className="select-container">
                        <select onClick={getTeamUsers}
                            onChange={(e) => { handleSelect(e.target.value) }}>
                            <option >Select user</option>
                            {
                                users.map((element) => (
                                    <option key={element._id} value={element._id}>{element.username}</option>
                                ))
                            }
                        </select>
                    </div>
                    <Button onClick={handleAdd} title="Add" />
                    <Button onClick={cancelAdd} title="Cancel" />
                </div>
            </div>
        </div>
    )
}

import React, { useCallback, useContext, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';
import Avatar from 'react-avatar';
import ButtonClean from '../button-clean';
import TeamContext from "../../contexts/TeamContext"



export default function TaskMembers(props) {



    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
    const [selectedUser, setSelectedUser] = useState({})
    const [users, setUsers] = useState([])
    const history = useHistory()
    const socket = useSocket()
    const teamContext = useContext(TeamContext)

    const projectId = props.project._id

    const cardMembers = props.cardMembers
    const cardId = props.cardId
    const listId = props.listId

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
        const response = await fetch(`http://localhost:4000/api/teams/get-users/${currentTeamId}`, {
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
        setUsers(data)

    }



    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


    const handleSelect = (id) => {
        const result = users.filter(obj => {
            return obj._id === id
        })[0]
        const selected = result._id
        setSelectedUser(selected)
    }

    const deleteMember = useCallback(async (event, member) => {
        event.preventDefault()
        let cardMembers = props.cardMembers

        var index = cardMembers.indexOf(member)
        if (index !== -1) {
            cardMembers.splice(index, 1)
        }

        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                members: cardMembers
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
        }

    }, [history, props, cardId, listId, updateProjectSocket])


    const handleAdd = useCallback(async (event) => {
        event.preventDefault()

        const token = getCookie("x-auth-token")

        let cardMembers = props.cardMembers
        cardMembers.push(selectedUser)

        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                members: cardMembers
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            setIsActive(!isActive)
            updateProjectSocket()
        }

    }, [history, props, cardId, listId, isActive, setIsActive, selectedUser, updateProjectSocket])



    return (
        <div>
            <div className={styles.buttoDiv}>
                <span>
                    {
                        cardMembers.map((member, index) => {
                            return (
                                <span key={index}>
                                    <Avatar name={member.username} size={30} round={true} maxInitials={2} onMouseEnter={<div>{member.username}</div>} onClick={(e) => { if (window.confirm('Are you sure you wish to delete this member?')) deleteMember(e, member) }} />
                                </span>
                            )
                        })
                    }
                </span>
                {
                    isActive ?
                        <span>
                            < form ref={dropdownRef} className={styles.container}  >
                                <select className={styles.select} onChange={(e) => { handleSelect(e.target.value) }}>
                                    <option>Select</option>
                                    {
                                        users.map(m => (
                                            <option key={m._id} value={m._id}>{m.username}</option>
                                        ))
                                    }
                                </select>
                                <button onClick={handleAdd}>Add</button>
                            </form>
                        </span> :
                        <ButtonClean className={styles.addListButton} onClick={() => { getTeamUsers(); setIsActive(!isActive) }} title='+' />
                }
            </div >
        </div>
    )
}


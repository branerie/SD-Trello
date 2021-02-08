import React, { useCallback, useContext, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import { useHistory, useParams } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider'
import Avatar from 'react-avatar'
import TeamContext from "../../contexts/TeamContext"
import pen from '../../images/pen.svg'


export default function TaskMembers(props) {

    const dropdownRef = useRef(null);
    const [cardMembers, setCardMembers] = useState(props.card.members)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [selectedUser, setSelectedUser] = useState('')
    const [showEachMember, setShowEachMember] = useState(false)

    const [users, setUsers] = useState([])
    const history = useHistory()
    const socket = useSocket()
    const teamContext = useContext(TeamContext)
    const params = useParams()
    const projectId = props.project._id
    const cardId = props.card._id
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

        let filtered = data.members

        // for (var arr in data) {
        for (let filter in cardMembers) {
            // if (data[arr]._id === cardMembers[filter]._id) {
            filtered = filtered.filter(function (obj) {
                return obj._id !== cardMembers[filter]._id
            })
            //         }
            //     }
        }
        setUsers(filtered)

    }

    const updateSocket = useCallback(() => {
        socket.emit('project-update', props.project)
        socket.emit('task-team-update', props.teamId)
    }, [socket, props.project, props.teamId])


    const handleSelect = (id) => {
        const result = users.filter(obj => {
            return obj._id === id
        })[0]
        const selected = result
        setSelectedUser(selected)
    }

    const deleteMember = useCallback(async (event, member) => {
        event.preventDefault()

        var index = cardMembers.indexOf(member)
        let arr = [...cardMembers]

        if (index !== -1) {
            arr.splice(index, 1)
        }

        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                members: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateSocket()
            setCardMembers(arr)
        }

    }, [history, cardId, listId, updateSocket, cardMembers])




    const handleAdd = useCallback(async (event) => {
        event.preventDefault()

        const teamId = params.teamid

        if (!selectedUser) {
            setIsActive(!isActive)
            return
        }

        const token = getCookie("x-auth-token")

        const project = props.project

        const result = project.membersRoles.filter(obj => {
            return obj.memberId._id === selectedUser._id
        })[0]
        if (!result) {
            if (window.confirm(`Do you want to add ${selectedUser.username} to project?`)) {
                const responseAdd = await fetch(`/api/projects/${projectId}/user`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        member: selectedUser,
                        admin: false
                    })
                })
                if (!responseAdd.ok) {
                    history.push("/error")
                }

            } else {
                return
            }
        }

        let arr = [...cardMembers]

        arr.push(selectedUser)

        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                members: arr,
                newMember: selectedUser,
                teamId,
                projectId: project._id,
                cardId,
                listId
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            setIsActive(!isActive)
            setCardMembers(arr)
            updateSocket()
            setSelectedUser('')
            socket.emit('message-sent', selectedUser._id)
        }

    }, [history, props, cardId, listId, isActive, setIsActive, selectedUser, updateSocket, cardMembers, projectId, params.teamid, socket])



    return (
        <div onMouseLeave={() => setShowEachMember(false)}>
            {
                showEachMember ?
                    <div className={styles.containerMemb} >
                        <div className={styles.allCardMembers}>
                            {
                                cardMembers.map((m, index) => {
                                    return (
                                        <div key={index} className={styles.eachMember} onClick={(e) => { if (window.confirm('Are you sure you wish to delete this member?')) deleteMember(e, m) }}>
                                            <span className={styles.avatar} key={m._id}>
                                                <Avatar key={m._id}
                                                    name={m.username}
                                                    size={30}
                                                    round={true}
                                                    maxInitials={2}
                                                    className={styles.avatar}
                                                />
                                            </span>
                                            <span>{m.username}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <div>
                        {
                            isActive ?
                                <span>
                                    < form ref={dropdownRef} className={styles.container}  >
                                        <select className={styles.select} onChange={(e) => { handleSelect(e.target.value) }}>
                                            <option>Select</option>
                                            {
                                                users.map((m, index) => (
                                                    <option key={index} value={m._id}>{m.username}</option>
                                                ))
                                            }
                                        </select>
                                        <button className={styles.addUserButton} onClick={handleAdd}>Add</button>
                                    </form>
                                </span >
                                :
                                <div className={styles.membersDiv}>
                                    {
                                        (cardMembers.length > 3) ?
                                            
                                                <span className={styles.members} onMouseEnter={() => setShowEachMember(true)}>
                                                    {cardMembers.slice(0, 3).map(element => {
                                                        return (
                                                            <span className={styles.avatar} key={element._id}>
                                                                <Avatar key={element._id}
                                                                    name={element.username}
                                                                    size={30}
                                                                    round={true}
                                                                    maxInitials={2}
                                                                    className={styles.avatar}
                                                                />
                                                            </span>
                                                        )
                                                    })}
                                                    <span className={styles.avatar}>
                                                        <Avatar color={'grey'} name={`+   ${(cardMembers.length - 3)} ${('0' + (cardMembers.length - 3)).slice(2)}`} size={30} round={true} maxInitials={3} className={styles.avatar}
                                                        />
                                                    </span>
                                                </span>

                                            
                                            :
                                            <span className={styles.members} onMouseEnter={() => setShowEachMember(true)}>
                                                {cardMembers.map(element => {
                                                    return (
                                                        <span className={styles.avatar} key={element._id}>
                                                            <Avatar key={element._id} name={element.username} size={30} round={true} maxInitials={2} />
                                                        </span>
                                                    )
                                                })}
                                            </span>
                                    }

                                    <img className={styles.pen} src={pen} alt="..." width="13" height="13" onClick={() => { getTeamUsers(); setIsActive(!isActive) }} />
                                </div >
                        }
                    </div>
            }
        </div >
    )
}


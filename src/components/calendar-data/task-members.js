import React, { useCallback, useContext, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider'
import Avatar from 'react-avatar'
import ButtonClean from '../button-clean';
import TeamContext from "../../contexts/TeamContext"
import pen from '../../images/pen.svg'



export default function TaskMembers(props) {


    const dropdownRef = useRef(null);
    const [cardMembers, setCardMembers] = useState(props.card.members)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [selectedUser, setSelectedUser] = useState({})
    const [users, setUsers] = useState([])
    const history = useHistory()
    const socket = useSocket()
    const teamContext = useContext(TeamContext)

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

        let filtered = data

        for (var arr in data) {
            for (var filter in cardMembers) {
                if (data[arr]._id === cardMembers[filter]._id) {
                    filtered = filtered.filter(function (obj) {
                        return obj._id !== cardMembers[filter]._id
                    })
                }
            }
        }
        setUsers(filtered)

    }

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


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
            updateProjectSocket()
            setCardMembers(arr)
        }

    }, [history, props, cardId, listId, updateProjectSocket])




    const handleAdd = useCallback(async (event) => {
        event.preventDefault()

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
                members: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            setIsActive(!isActive)
            setCardMembers(arr)
            updateProjectSocket()
        }

    }, [history, props, cardId, listId, isActive, setIsActive, selectedUser, updateProjectSocket])



    return (
        <div>
            {(cardMembers.length > 3) ?
                <div className={styles.membersContainer}>
                    <span className={styles.membersDiv}>
                        {
                            cardMembers.slice(0, 3).map((member, index) => {
                                return (
                                    <span key={index}>
                                        <Avatar name={member.username} size={props.size} round={true} maxInitials={2} />
                                    </span>
                                )
                            })
                        }
                        <span >
                            <Avatar name={`+   ${cardMembers.length-3}`} size={props.size} round={true} maxInitials={3} />
                        </span>
                    </span>
                </div >
                :
                <div className={styles.membersContainer}>
                    <span className={styles.membersDiv}>
                        {
                            cardMembers.map((member, index) => {
                                return (
                                    <span key={index}>
                                        <Avatar name={member.username} size={props.size} round={true} maxInitials={2} />
                                    </span>
                                )
                            })
                        }
                    </span>
                </div >

            }
        </div>
    )
}


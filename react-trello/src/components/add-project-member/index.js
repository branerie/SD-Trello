import React, { useCallback, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'



export default function AddMember(props) {

    const members = props.members
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const [admin, setAdmin] = useState(false)


    const history = useHistory()

    const projectId = props.project._id

    const cancelAdd = () => {
        props.hideFormAdd()
    }


    const getAllUser = async () => {
        const token = getCookie("x-auth-token")
        const response = await fetch('http://localhost:4000/api/user/get-all', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        if (!response.ok) {
            history.push("/error")
        }
        const allUsers = await response.json()


        const filtered = allUsers.filter((e) => {
            const found = members.find(element => element.username === e.username)
            if (found) {
                return false
            } else {
                return true
            }
        })

        setUsers(filtered)
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
        const memberId = member.id

        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/${projectId}/user-remove`, {
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
            props.hideFormAdd()
        }

    }, [history, props])


    const handleAdd = useCallback(async (event) => {
        event.preventDefault()
        const projectId = props.project._id
        const token = getCookie("x-auth-token")

        const member = selectedUser

        const response = await fetch(`http://localhost:4000/api/projects/${projectId}/user`, {
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
            props.hideFormAdd()
        }

    }, [history, projectId, props, selectedUser, admin])

    return (
        <div className={styles.form}>
            <div className={styles.currentMembers}>
                <Title title={"Team members"} />
                {
                    members.map((element, index) => {
                        return <Button key={index} onClick={(e) => { if (window.confirm('Are you sure you wish to delete this member?')) deleteMember(e, element) }} title={element.username} />
                    })
                }
            </div>
            <div>
                <div className={styles.container} >
                    <div className="select-container">
                        <select onClick={getAllUser}
                            onChange={(e) => { handleSelect(e.target.value) }}>
                            <option >Select user</option>
                            {
                                users.map((element, index) => (
                                    <option key={index} value={element._id}>{element.username}</option>
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

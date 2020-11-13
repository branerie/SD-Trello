import React, { useCallback, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'



export default function AddMember(props) {

    const members = props.card.members
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})

    const history = useHistory()


    const cardId = props.card._id
    const listId = props.listId

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
        setUsers(await response.json())

    }


    const handleSelect = (id) => {
        const result = users.filter(obj => {
            return obj._id === id
        })[0]
        setSelectedUser(result)
    }

    const deleteMember = useCallback(async (event, member) => {
        event.preventDefault()

        var index = members.indexOf(member)
        if (index !== -1) {
            members.splice(index, 1)
        }

        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                members
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            props.hideFormAdd()
        }

    }, [history, props, members, cardId, listId])


    const handleAdd = useCallback(async (event) => {
        event.preventDefault()

        const token = getCookie("x-auth-token")

        members.push(selectedUser)

        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                members
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            props.hideFormAdd()
        }

    }, [history, listId, cardId, members, props, selectedUser])

    return (
        <div className={styles.form}>
            <div className={styles.currentMembers}>
                <Title title={"Card members"} />
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

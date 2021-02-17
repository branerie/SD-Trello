import React, { useCallback, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import Button from '../button'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import ConfirmDialog from '../confirmation-dialog'




export default function AddMember(props) {
    const params = useParams()
    const members = props.card.members
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currElement, setCurrElement] = useState('')
    const [confirmTitle, setConfirmTitle] = useState('')

    const history = useHistory()


    const cardId = props.card._id
    const listId = props.listId

    const cancelAdd = () => {
        props.hideFormAdd()
    }

    const getAllUser = async () => {
        const id = params.projectid
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/info/${id}`, {
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
      setUsers(data.membersRoles)
       
    }

    const handleSelect = (id) => {
        const result = users.filter(obj => {
            return obj.memberId._id === id
        })[0]
       const selected = result.memberId
        setSelectedUser(selected)
    }

    const deleteMember = useCallback(async (member) => {

        var index = members.indexOf(member)
        if (index !== -1) {
            members.splice(index, 1)
        }

        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
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

        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
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

    let confirmationObjectFunctions = {        
        'delete this member': deleteMember        
    }

    return (
        <div className={styles.form}>
            {confirmOpen &&
                <ConfirmDialog
                    title={'you wish to delete this member'}
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={() => confirmationObjectFunctions[confirmTitle](currElement)}
                />
            }
            <div className={styles['current-members']}>
                <Title title={"Card members"} />
                {
                    members.map((element, index) => {
                        return <Button key={index} 
                        onClick={() => {
                            setConfirmOpen(true)
                            setConfirmTitle('delete this member')
                            setCurrElement(element)
                        }}
                        title={element.username} />
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
                                    <option key={index} value={element.memberId._id}>{element.memberId.username}</option>
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

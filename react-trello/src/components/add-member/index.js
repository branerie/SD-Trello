import React, { useCallback, useState } from 'react'
import { useHistory } from "react-router-dom"
import SubmitButton from '../button/submit-button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'



export default function AddMember(props) {
    
    const [email, setEmail] = useState("")
    const [userId, setuserID] = useState(props.card.description)
    const [members, setMembers] = useState(props.card.members)

    const history = useHistory()

    const cardId = props.card._id
    const listId = props.listId

    const cancelAdd = () => {
        props.hideFormAdd()
    }

    const deleteMember = useCallback(async (event) => {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            props.hideFormEdit()
        }

    }, [history, props, cardId, listId])


    const handleAdd = useCallback(async (event) => {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                members: []
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            props.hideFormAdd()
        }

    }, [history, members, listId, cardId, props])

    return (
        <div className={styles.form}>
            <form className={styles.container} >
                <Title title={"Select member"} />
                {
                    members.map((element, index) => {
                        return <SubmitButton  key={index} onClick={(e) => { if (window.confirm('Are you sure you wish to delete this member?')) deleteMember(e) }} title={element.username} />
                    })
                }
                <Input
                value={email}
                    onChange={e => setEmail(e.target.value)}
                    label="Enter User email"
                    id="email"
                />
                <SubmitButton onClick={handleAdd} title="+" />
                <SubmitButton onClick={cancelAdd} title="Cancel" />
            </form>
        </div>
    )
}

import React, { useCallback, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
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

    }, [history, props, cardId, listId])


    const handleAdd = useCallback(async (event, email) => {
        event.preventDefault()

        const token = getCookie("x-auth-token")
        const user = await fetch(`http://localhost:4000/api/user/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!user.ok) {
            history.push("/error")
        }
        console.log(user);
        members.push(user)
        console.log(members);
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

    }, [history, listId, cardId, props])

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
                <form className={styles.container} >
                    <Title title={"Add new member"} />
                    <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        label="Enter User email"
                        id="email"
                    />
                    <Button onClick={handleAdd} title="Add" />
                    <Button onClick={cancelAdd} title="Cancel" />
                </form>
            </div>
        </div>
    )
}

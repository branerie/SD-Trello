import React, { useCallback, useContext, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import TeamContext from '../../contexts/TeamContext'

export default function CreateTeam(props) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const history = useHistory()
    const teamContext = useContext(TeamContext)

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch('http://localhost:4000/api/teams', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                members: []
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const team = await response.json()
            const arr = [...teamContext.teams]
            arr.push(team)
            teamContext.setTeams(arr)

            props.setOption(team._id)
            props.hideForm()
        }

    }, [history, name, description, props, teamContext])

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Create Team" />
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Name"
                    id="name"
                />
                <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    label="Description"
                    id="description"
                />
                {/* <Input
                    value={members}
                    onChange={e => setProgress(e.target.value)}
                    label="Members"
                    id="members"
                /> */}
                <Button title="Create" />
            </form>
        </div>
    )
}

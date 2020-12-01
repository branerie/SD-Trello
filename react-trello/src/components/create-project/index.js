import React, { useCallback, useState, useContext } from 'react'
import { useHistory, useParams } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import ProjectContext from '../../contexts/ProjectContext'

export default function CreateProject(props) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const projectContext = useContext(ProjectContext)
    const history = useHistory()
    const params = useParams()

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        const teamId = params.teamid
        const token = getCookie("x-auth-token")
        const response = await fetch('http://localhost:4000/api/projects', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                teamId
            })
        })
        if (!response.ok) {
            history.push('/error')
            return
        } else {
            const project = await response.json()
            projectContext.setProject(project._id)
            document.cookie = `pid=${project._id}`
            history.push(`/projects/${project._id}`)
        }
    }, [history, name, description])

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Create Project" />
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
                <Button title="Create" />
            </form>
        </div>
    )
}

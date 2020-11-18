import React, { useState, useEffect, useCallback } from "react"
import { useParams, useHistory } from "react-router-dom"
import EditProfile from "../../components/edit-profile"
import PageLayout from "../../components/page-layout"
import Transparent from "../../components/transparent"

const ProfilePage = () => {
    const [username, setUsername] = useState(null)
    const [projects, setProjects] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const params = useParams()
    const history = useHistory()


    const getData = useCallback(async () => {
        const id = params.userid;

        const response = await fetch(`http://localhost:4000/api/user/${id}`)
        if (!response.ok) {
            history.push("/error")
        } else {
            const user = await response.json()
            setUsername(user.username)
            setProjects(user.projects && user.projects.length)
        }
    }, [params.userid, history])

    const showForm = () => {
        setIsVisible(true)
    }

    const hideForm = () => {
        getData()
        setIsVisible(false)
    }

    useEffect(() => {
        getData()
    }, [getData])

    if (!username) {
        return (
            <PageLayout>
                <div>Loading...</div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div>
                <p>User: {username}</p>
                <p>Projects: {projects}</p>
                <button onClick={showForm}>Edit Profile</button>
                {
                    isVisible ?
                        <div>
                            <Transparent hideForm={hideForm}>
                                <EditProfile hideForm={hideForm} />
                            </Transparent>
                        </div> : null
                }
            </div>
        </PageLayout>
    )
}

export default ProfilePage;
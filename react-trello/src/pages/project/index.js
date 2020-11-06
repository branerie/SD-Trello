import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams, useHistory } from "react-router-dom"
import EditProfile from "../../components/edit-profile"
import PageLayout from "../../components/page-layout"
import Transparent from "../../components/transparent"
import UserContext from "../../Context"
import getCookie from "../../utils/cookie"
import styles from './index.module.css'
import Project from '../../components/project'

const ProjectsPage = () => {
    const [username, setUsername] = useState(null)
    const [projects, setProjects] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const context = useContext(UserContext)
    const params = useParams()
    const history = useHistory()


    const getData = useCallback(async () => {

        const token = getCookie("x-auth-token");

        const response = await fetch(`http://localhost:4000/api/projects/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const data = await response.json() 
            setProjects(data)
        }
    }, [])
   
    
    useEffect(() => {
        getData()
    }, [getData])

    if (!projects) {
        return (
            <PageLayout>
                <div>Loading...</div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div>            
                {projects.map((project, index) => {
                    return (
                        <Project key={project._id} index={index} projects={project} />
                    )
                    })}
            </div>
        </PageLayout>
    )
}

export default ProjectsPage;
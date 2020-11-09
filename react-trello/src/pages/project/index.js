import React, { useState, useEffect, useCallback } from "react"
import { useHistory } from "react-router-dom"
import PageLayout from "../../components/page-layout"
import getCookie from "../../utils/cookie"
import Project from '../../components/project'

const ProjectsPage = () => {

    const [projects, setProjects] = useState(null)
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
                        <Project key={project._id} index={index} project={project} />
                    )
                    })}
            </div>
        </PageLayout>
    )
}

export default ProjectsPage;
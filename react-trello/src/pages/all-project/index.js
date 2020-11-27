import React, { useState, useEffect, useCallback } from "react"
import { useHistory } from "react-router-dom"
import PageLayout from "../../components/page-layout"
import getCookie from "../../utils/cookie"
import Project from '../../components/project'
import Button from "../../components/button"
import Transparent from "../../components/transparent"
import CreateProject from '../../components/create-project'
import Loader from "react-loader-spinner"

const AllProjectsPage = () => {

    const [projects, setProjects] = useState(null)
    const history = useHistory()
    const [isVisible, setIsVisible] = useState(false)

    const showForm = () => {
        setIsVisible(true)
    }

    const hideForm = () => {
        setIsVisible(false)
    }

    if (!projects) {
        return (
            <PageLayout>
                <Loader
                    type="TailSpin"
                    color="#363338"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
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
            <Button title='New Project' onClick={showForm} />
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={hideForm}>
                            <CreateProject hideForm={hideForm} />
                        </Transparent>
                    </div> : null
            }
        </PageLayout>
    )
}

export default AllProjectsPage;
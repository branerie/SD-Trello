import React, { useState, useEffect, useContext } from "react"
import PageLayout from "../../components/page-layout"
import Project from '../../components/project'
import Button from "../../components/button"
import Transparent from "../../components/transparent"
import CreateProject from '../../components/create-project'
import TeamContext from "../../contexts/TeamContext"

const TeamPage = () => {

    const [isVisible, setIsVisible] = useState(false)
    const teamContext = useContext(TeamContext)

    useEffect(() => {
        return () => teamContext.setOption('select')
    })

    return (
        <PageLayout>
            <div>
                {teamContext.currentTeam.projects.map((project, index) => {
                    return (
                        <Project key={project._id} index={index} project={project} />
                    )
                })}
            </div>
            <Button title='New Project' onClick={() => setIsVisible(true)} />
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={() => setIsVisible(false)}>
                            <CreateProject hideForm={() => setIsVisible(false)} />
                        </Transparent>
                    </div> : null
            }
        </PageLayout>
    )
}

export default TeamPage;
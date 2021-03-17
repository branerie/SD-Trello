import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TeamContext from '../../../contexts/TeamContext'
import ProjectContext from '../../../contexts/ProjectContext'
import commonStyles from '../index.module.css'
import LinkComponentTitle from '../../LinkTitle'
import ButtonClean from '../../ButtonClean'
import Transparent from '../../Transparent'
import CreateProject from '../../CreateProject'
import ButtonCleanTitle from '../../ButtonCleanTitle'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'

const ProjectDropdown = () => {
    const { currentProjects } = useContext(TeamContext)
    const { project } = useContext(ProjectContext)
    const [isShownProjectForm, setIsShownProjectForm] = useState(false)
    const [isShownOldProjects, setIsShownOldProjects] = useState(false)
    const [isProjectActive, setIsProjectActive, projectRef] = useDetectOutsideClick()
    const params = useParams()

    useEffect(() => {
        
        if (project.isFinished === true) {
           return setIsShownOldProjects(true)
        }

        setIsShownOldProjects(false)
        
    }, [project.isFinished])


    return (
        <div className={`${commonStyles.container} ${commonStyles['project-media']}`}>
            <div className={commonStyles.title}>Project:</div>
            <div className={commonStyles['dropdown-container']}>
                <ButtonCleanTitle
                    className={commonStyles.button}
                    onClick={() => setIsProjectActive(!isProjectActive)}
                    title={project.name}
                />
                {isProjectActive && <div ref={projectRef} className={commonStyles.dropdown} >
                    <div className={commonStyles['options-container']} >
                        {currentProjects.filter(p => isShownOldProjects === !!(p.isFinished))
                            .reverse()
                            .map(p => (
                                <LinkComponentTitle
                                    href={`/project-board/${params.teamid}/${p._id}`}
                                    key={p._id}
                                    title={p.name}
                                    onClick={() => setIsProjectActive(false)}
                                    className={commonStyles.options}
                                />
                            ))
                        }
                    </div>
                    <ButtonClean
                        onClick={() => setIsShownProjectForm(true)}
                        title='Create Project'
                        className={`${commonStyles.options} ${commonStyles['last-option']}`}
                    />
                </div>}
            </div>
            {isShownProjectForm &&  <Transparent hideForm={() => setIsShownProjectForm(false)}>
                                        <CreateProject hideForm={() => setIsShownProjectForm(false)} />
                                    </Transparent>}
        </div>
    )
}

export default ProjectDropdown
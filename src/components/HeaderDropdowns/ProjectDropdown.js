import React, { useContext, useEffect, useState } from 'react'
import styles from './index.module.css'
import TeamContext from '../../contexts/TeamContext'
import ProjectContext from '../../contexts/ProjectContext'
import LinkComponentTitle from '../LinkTitle'
import { useParams } from 'react-router-dom'
import ButtonClean from '../ButtonClean'
import Transparent from '../Transparent'
import CreateProject from '../CreateProject'
import ButtonCleanTitle from '../ButtonCleanTitle'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

export default function ProjectDropdown() {
    const teamContext = useContext(TeamContext)
    const projectContext = useContext(ProjectContext)
    const params = useParams()
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showOldProjects, setShowOldProjects] = useState(false)
    const [isProjectActive, setIsProjectActive, projectRef] = useDetectOutsideClick()

    useEffect(() => {
        if (projectContext.project.isFinished === true) {
            setShowOldProjects(true)
        } else {
            setShowOldProjects(false)
        }
    }, [projectContext.project.isFinished])


    return (
        <div className={`${styles.container} ${styles['project-media']}`}>
            <div className={styles.title}>Project:</div>
            <div className={styles['dropdown-container']}>
                <ButtonCleanTitle
                    className={styles.button}
                    onClick={() => setIsProjectActive(!isProjectActive)}
                    title={projectContext.project.name}
                />
                {isProjectActive && <div ref={projectRef} className={styles.dropdown} >
                    <div className={styles['options-container']} >
                        {teamContext.currentProjects.filter(!showOldProjects ? (p => (p.isFinished === false) || (p.isFinished === undefined)) : (p => (p.isFinished === true)))
                            .reverse()
                            .map(p => (
                                <LinkComponentTitle
                                    href={`/project-board/${params.teamid}/${p._id}`}
                                    key={p._id}
                                    title={p.name}
                                    onClick={() => { setIsProjectActive(false) }}
                                    className={styles.options}
                                />
                            ))
                        }
                    </div>
                    <ButtonClean
                        onClick={() => setShowProjectForm(true)}
                        title='Create Project'
                        className={`${styles.options} ${styles['last-option']}`}
                    />
                </div>}
            </div>

            {showProjectForm && <Transparent hideForm={() => setShowProjectForm(false)}>
                <CreateProject hideForm={() => setShowProjectForm(false)} />
            </Transparent>}
        </div>
    )
}
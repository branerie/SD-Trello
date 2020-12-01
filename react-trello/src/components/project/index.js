import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import ProjectContext from '../../contexts/ProjectContext'
import styles from './index.module.css'

export default function Project(props) {
    const projectContext = useContext(ProjectContext)

    const onClick = () => {
        projectContext.setProject(props.project._id)
        document.cookie = `pid=${props.project._id}`
    }

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Link to={`/projects/${props.project._id}`} onClick={onClick} className={styles.projectname}>{props.project.name}</Link>
                <div className={styles.username}>Creator: {props.project.author.username}</div>
            </div>
            <div className={styles.description}>Description: {props.project.description}</div>
        </div>
    )
}

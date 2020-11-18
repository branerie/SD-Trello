import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.module.css'

export default function Project(props) {
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Link to={`/projects/${props.project._id}`} className={styles.projectname}>{props.project.name}</Link>
                <div className={styles.username}>Creator: {props.project.author.username}</div>
            </div>
            <div className={styles.description}>Description: {props.project.description}</div>
        </div>
    )
}

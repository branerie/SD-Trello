import React from 'react'
import { Link } from 'react-router-dom';
import styles from './index.module.css'

export default function Project(props) {
    console.log(props.projects);
    return (
        <Link className={styles.container}>
            <div>
                <h1 className={styles.projectname}>{props.projects.name}</h1>
                <div className={styles.projectother}>Description: {props.projects.description}</div>
            </div>
            <div className={styles.projectother}>Creator: {props.projects.author.username}</div>
            {/* <div className={styles.members}>Members: {props.members}</div> */}
        </Link>
    )
}

import React from 'react'
import styles from './index.module.css'

export default function Project(props) {
    console.log(props.projects);
    return (
        <div className={styles.container}>
            <div className={styles.name}>Name : {props.projects.name}</div>
            <div className={styles.author}>Creator: {props.projects.author}</div>
            <div className={styles.description}>Description: {props.projects.description}</div>
            {/* <div className={styles.members}>Members: {props.members}</div> */}
        </div>
    )
}

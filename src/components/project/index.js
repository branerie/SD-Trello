import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EditProject from '../edit-project'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function Project(props) {
    const [isVisible, setIsVisible] = useState(false)
    const params = useParams()

    return (
        <div className={styles.container}>
            <Link to={`/project-board/${params.teamid}/${props.project._id}`}  className={styles.projectname}>Name: {props.project.name}</Link>


            <div className={styles.username}>
                <div className={styles.creator}>
                    Creator: {props.project.author.username}
                </div>
                {isVisible ?
                    < div >
                        <Transparent hideForm={() => setIsVisible(!isVisible)} >
                            <EditProject hideForm={() => setIsVisible(!isVisible)} project={props.project} />
                        </Transparent >
                    </div > : null
                }
                <div className={styles.info} onClick={() => setIsVisible(!isVisible)}>
                    Info
                </div>
            </div>
        </div>
    )
}

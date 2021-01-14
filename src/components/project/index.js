import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EditProject from '../edit-project'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function Project(props) {
    const [isVisible, setIsVisible] = useState(false)
    const params = useParams()

    return (
        <div>
            {isVisible ?
                < div >
                    <Transparent hideForm={() => setIsVisible(!isVisible)} >
                        <EditProject hideForm={() => setIsVisible(!isVisible)} project={props.project} />
                    </Transparent >
                </div > : null
            }
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <Link to={`/project-board/${params.teamid}/${props.project._id}`} className={styles.key}>Name: <span className={styles.value}>{props.project.name}</span></Link>

                    <div className={styles.key}>
                        Creator: <span className={styles.value}>{props.project.author.username}</span>
                    </div>
                </div>

                <div className={styles.info} onClick={() => setIsVisible(!isVisible)}>
                    Info
            </div>
            </div>
        </div>
    )
}

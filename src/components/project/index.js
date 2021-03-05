import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ButtonGrey from '../ButtonGrey'
import EditProject from '../EditProject'
import Transparent from '../Transparent'
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
                <div className={styles['top-side']}>
                    <Link to={`/project-board/${params.teamid}/${props.project._id}`} className={styles.key}>Name: <span className={styles.value}>{props.project.name}</span></Link>

                </div >
                <div className={styles['lower-side']}>
                    <div className={styles['key-lower']}>
                        Creator: <span className={styles.value}>{props.project.author.username}</span>
                    </div>
                    <div className={styles.info} >
                        <ButtonGrey className={styles['info-btn']} title={'Info'} onClick={() => setIsVisible(!isVisible)} />
                    </div>
                </div>

            </div>
        </div>
    )
}

import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './index.module.css'
import ButtonGrey from '../ButtonGrey'
import EditProject from '../EditProject'
import Transparent from '../Transparent'

const Project = ({ project }) => {
    const params = useParams()
    const [isEditTeamShown, setIsEditTeamShown] = useState(false)


    return (
        <div>
            {
                isEditTeamShown &&
                < div >
                    <Transparent hideForm={() => setIsEditTeamShown(!isEditTeamShown)} >
                        <EditProject hideForm={() => setIsEditTeamShown(!isEditTeamShown)} project={project} />
                    </Transparent >
                </div >
            }
            <div className={styles.container}>
                <div className={styles['top-side']}>
                    <Link to={`/project-board/${params.teamid}/${project._id}`} className={styles.key}>
                        Name: <span className={styles.value}>{project.name}</span>
                    </Link>
                </div >
                <div className={styles['lower-side']}>
                    <div className={styles['key-lower']}>
                        Creator: <span className={styles.value}>{project.author.username}</span>
                    </div>
                    <div className={styles.info} >
                        <ButtonGrey
                            className={styles['info-btn']}
                            title={'Info'}
                            onClick={() => setIsEditTeamShown(!isEditTeamShown)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project

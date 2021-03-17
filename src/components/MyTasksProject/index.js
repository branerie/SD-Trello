import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.module.css'
import MyTasksTask from '../../components/MyTasksTask'

const MyTasksProject = ({ project, teamId }) => {
    
    return (
        <div key={project._id} className={styles.project}>
            <div className={styles['project-name']}>
                <Link to={`/project-board/${teamId}/${project._id}`} className={styles.link}>
                    <span className={styles.bold}>Project:</span> {project.name}
                </Link>
            </div>
            <div className={`${styles.header} ${styles.raw}`}>
                <div className={styles.list}>List:</div>
                <div className={styles.container}>
                    <div className={styles.task}>Task:</div>
                    <div className={styles.progress}>Progress (%):</div>
                    <div className={styles.days}>Days Till End:</div>
                </div>
            </div>
            { project.lists.map(list => {
                return (
                    <div key={list._id} className={styles.raw}>
                        <div className={styles.list}>{list.name}</div>
                        <div className={styles['task-container']}>
                            {list.cards.map(card => {
                                return (
                                    <MyTasksTask
                                        key={card._id}
                                        teamId={teamId}
                                        project={project}
                                        list={list}
                                        card={card}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MyTasksProject
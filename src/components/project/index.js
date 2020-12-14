import React, {  useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProjectContext from '../../contexts/ProjectContext'
import EditProject from '../edit-project'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function Project(props) {
    const projectContext = useContext(ProjectContext)
    const [isVisible, setIsVisible] = useState(false)
    const params = useParams()

    const onClick = () => {
        projectContext.setProject(props.project._id)
        document.cookie = `pid=${props.project._id}`
    }
    
    

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Link to={`/project-board/${params.teamid}/${props.project._id}`} onClick={onClick} className={styles.projectname}>Name: {props.project.name}</Link>
                <div>

                    <div className={styles.username}>Creator: {props.project.author.username}</div>

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
        </div>
    )
}

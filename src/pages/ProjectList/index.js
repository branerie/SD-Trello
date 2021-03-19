import React, { useCallback, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { useSocket } from '../../contexts/SocketProvider'
import ProjectContext from '../../contexts/ProjectContext'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import CalendarTable from '../../components/CalendarTable'


const ProjectList = () => {
    const socket = useSocket()
    const { projectid: projectId } = useParams()
    const { project, setProject } = useContext(ProjectContext)

    const projectUpdate = useCallback((project) => {
        setProject(project)
    }, [setProject])

    useEffect(() => {
        const id = projectId

        if (socket == null) return

        socket.on('project-updated', projectUpdate)

        socket.emit('project-join', id)
        return () => socket.off('project-updated')
    }, [socket, projectUpdate, projectId])

    return (
        <PageLayout contentClassName={styles['layout-container']}>
            { !project || project._id !== projectId
                ? <Loader
                    type='TailSpin'
                    color='#363338'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
                : <div className={styles.calendarPageContainer}>
                    <div className={styles['calendar-container']}>
                        <CalendarTable/>
                    </div>
                </div>
            }
        </PageLayout>
    )
}

export default ProjectList
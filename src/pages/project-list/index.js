import React, { useCallback, useEffect, useContext } from 'react'
import { useParams } from "react-router-dom"
import PageLayout from '../../components/page-layout'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import TableDndApp from '../../components/calendar-table'
import Loader from 'react-loader-spinner'
import ProjectContext from '../../contexts/ProjectContext'


export default function ProjectList() {
    const params = useParams()

    const socket = useSocket()
    const projectContext = useContext(ProjectContext)

    const projectUpdate = useCallback((project) => {
        projectContext.setProject(project)
    }, [projectContext])

    useEffect(() => {
        const id = params.projectid

        if (socket == null) return

        socket.on('project-updated', projectUpdate)

        socket.emit('project-join', id)
        return () => socket.off('project-updated')
    }, [socket, projectUpdate, params.projectid])

    if (!projectContext.project || projectContext.project._id !== params.projectid) {
        return (
            <PageLayout>
                <Loader
                    type="TailSpin"
                    color="#363338"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
            </PageLayout>
        )
    }

    return (
        <PageLayout contentClassName={styles['layout-container']}>
            <div className={styles.calendarPageContainer}>
                <div>
                    <div className={styles['calendar-container']}>
                        <TableDndApp project={projectContext.project} />
                        {/* <TableDndApp2 filter={filter} /> */}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useParams } from "react-router-dom"
import PageLayout from '../../components/page-layout'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import TableDndApp from '../../components/calendar-table'
import Loader from 'react-loader-spinner'
import ProjectContext from '../../contexts/ProjectContext'
import ButtonClean from '../../components/button-clean'

export default function ProjectList() {
    const params = useParams()
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [filter, setFilter] = useState({'Not Started': true, 'In Progress': true, 'Done': true})

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

    const progressFilter = (filtered) => {
        const obj = {...filter}
        obj[filtered] = !obj[filtered]
        setFilter(obj)
    }

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
        <PageLayout className={styles.conteiner}>
            <ButtonClean
                className={styles.filter}
                onClick={() => setIsFilterActive(!isFilterActive)}
                title='Task filters'
            />
            {
                isFilterActive ? <div
                >
                    <ButtonClean
                        title={'Not Started'}
                        onClick={() => progressFilter('Not Started')}
                        className={`${styles.filter} ${!filter['Not Started'] ? styles['filter-off'] : ''}`}
                    />
                    <ButtonClean
                        title={'In Progress'}
                        className={`${styles.filter} ${!filter['In Progress'] ? styles['filter-off'] : ''}`}
                        onClick={() => progressFilter('In Progress')}
                    />
                    <ButtonClean
                        title={'Done'}
                        className={`${styles.filter} ${!filter['Done'] ? styles['filter-off'] : ''}`}
                        onClick={() => progressFilter('Done')}
                    />
                </div> : null
            }
            <div className={styles.calendarPageContainer}>
                <div>
                    <div className={styles.calendarContainer}>
                        <TableDndApp project={projectContext.project} filter={filter} />
                    </div>
                </div>
            </div>
        </PageLayout >
    )
}
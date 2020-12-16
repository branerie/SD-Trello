import React, { useCallback, useEffect, useState, useContext, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom"
import PageLayout from '../../components/page-layout'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import styles from './index.module.css'
import TableDndApp from '../../components/calendar-table'
import Loader from 'react-loader-spinner'
import ProjectContext from '../../contexts/ProjectContext'
import ButtonClean from '../../components/button-clean'

export default function ProjectList() {
    const params = useParams()
    const history = useHistory()
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [filter, setFilter] = useState({'Not Started': true, 'In Progress': true, 'Done': true})
    const [project, setProject] = useState(null)

    const socket = useSocket()
    const projectContext = useContext(ProjectContext)

    const projectUpdate = useCallback((project) => {
        setProject(project)
    }, [])

    useEffect(() => {
        const id = params.projectid

        if (socket == null) return

        socket.on('project-updated', projectUpdate)

        socket.emit('project-join', id)
        return () => socket.off('project-updated')
    }, [socket, projectUpdate])

    const getData = useCallback(async () => {
        const id = params.projectid
        const token = getCookie("x-auth-token");

        const response = await fetch(`/api/projects/info/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const data = await response.json()
            setProject(data)
        }


    }, [params.projectid, history])

    useEffect(() => {
        getData()
        const pid = params.projectid
        if (pid && pid !== projectContext.project) {
            projectContext.setProject(pid)
        }
    }, [])

    const progressFilter = (filtered) => {
        const obj = {...filter}
        obj[filtered] = !obj[filtered]
        setFilter(obj)
    }

    if (!project) {
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
                        <TableDndApp project={project} filter={filter} />
                    </div>
                </div>
            </div>
        </PageLayout >
    )
}
import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useParams } from "react-router-dom"
import PageLayout from '../../components/page-layout'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import TableDndApp from '../../components/calendar-table'
import Loader from 'react-loader-spinner'
import ProjectContext from '../../contexts/ProjectContext'
import ButtonClean from '../../components/button-clean'
import ButtonCleanDropdown from '../../components/button-clean-dropdown'

export default function ProjectList() {
    const params = useParams()
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [filter, setFilter] = useState({
        bool: {
            'Not Started': true,
            'In Progress': true,
            'Done': true,
        },
        member: null,
        isUsed: false
    })

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

    const toggleFilter = (filterName) => {
        const newFilters = { ...filter }

        // deactivate all other filters on initial filter click
        if (!filter.isUsed) {
            for (let key in newFilters.bool) {
                newFilters.bool[key] = false
            }
        }

        newFilters.bool[filterName] = !newFilters.bool[filterName]

        // reset filters to initial state if all are set to true
        newFilters.isUsed = !Object.values(newFilters.bool).every(f => f)

        setFilter(newFilters)
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
                isFilterActive &&
                <div className={styles.filters}>
                    <ButtonClean
                        title={'Not Started'}
                        onClick={() => toggleFilter('Not Started')}
                        className={`${styles.filter} ${!filter.bool['Not Started'] 
                                                            ? styles['filter-off'] : 
                                                            ''}`}
                    />
                    <ButtonClean
                        title={'In Progress'}
                        className={`${styles.filter} ${!filter.bool['In Progress'] 
                                                            ? styles['filter-off'] 
                                                            : ''}`}
                        onClick={() => toggleFilter('In Progress')}
                    />
                    <ButtonClean
                        title={'Done'}
                        className={`${styles.filter} ${!filter.bool['Done'] 
                                                            ? styles['filter-off'] 
                                                            : ''}`}
                        onClick={() => toggleFilter('Done')}
                    />
                    <ButtonCleanDropdown
                        options={projectContext.project.membersRoles.map(mr => {
                            return { value: mr.memberId._id, displayValue: mr.memberId.username }
                        })}
                        title={(filter.member && filter.member.name) || 'Member'}
                        onOptionClick={(memberId, memberName) => setFilter({
                            ...filter,
                            member: { id: memberId, name: memberName }
                        })}
                        onOptionClear={() => setFilter({ ...filter, member: null })}
                    />
                </div>
            }
            <div className={styles.calendarPageContainer}>
                <div>
                    <div className={styles.calendarContainer}>
                        <TableDndApp project={projectContext.project} filter={filter} />
                        {/* <TableDndApp2 filter={filter} /> */}
                    </div>
                </div>
            </div>
        </PageLayout >
    )
}
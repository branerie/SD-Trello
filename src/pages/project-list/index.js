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
import DueDateFilter from '../../components/due-date-filter'

export default function ProjectList() {
    const params = useParams()
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [filter, setFilter] = useState({
        bool: {
            notStarted: true,
            inProgress: true,
            done: true,
        },
        member: null,
        dueBefore: null,
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

    const setMemberFilter = (memberId, memberName) => {
        setFilter({ ...filter, member: { id: memberId, name: memberName } })
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
        <PageLayout contentStyle={{ margin: '5rem 0.2rem 0 3.5rem', padding: 0 }}>
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
                        onClick={() => toggleFilter('notStarted')}
                        className={
                            `${styles.filter} ${!filter.bool.notStarted && styles['filter-off']}`
                        }
                    />
                    <ButtonClean
                        title={'In Progress'}
                        className={
                            `${styles.filter} ${!filter.bool.inProgress && styles['filter-off']}`}
                        onClick={() => toggleFilter('inProgress')}
                    />
                    <ButtonClean
                        title={'Done'}
                        className={
                            `${styles.filter} ${!filter.bool.done && styles['filter-off']}`}
                        onClick={() => toggleFilter('done')}
                    />
                    <ButtonCleanDropdown
                        options={projectContext.project.membersRoles.map(mr => ({
                            value: mr.memberId._id, 
                            displayValue: mr.memberId.username
                        }))}
                        title={(filter.member && filter.member.name) || 'Member'}
                        isAssigned={!!(filter.member)}
                        onOptionClick={setMemberFilter}
                        onOptionClear={() => setFilter({ ...filter, member: null })}
                    />
                    <DueDateFilter 
                        dueBefore={filter.dueBefore} 
                        filterStyle={styles.filter} 
                        onChange={date => setFilter({...filter, dueBefore: date })}
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
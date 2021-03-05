import React from 'react'
import styles from './index.module.css'
import MembersFilter from '../FilterMembers'
import DueDateFilter from '../FilterDueDate'
import ProgressFilters from '../FilterProgress'

const TaskFilters = ({ filter, setFilter }) => {
    const toggleProgressFilter = (filterName) => {
        const currentFilterValue = filter.progress[[filterName]]

        setFilter({ ...filter, progress: { ...filter.progress, [filterName]: !currentFilterValue } })
    }

    return (
        <div className={styles['filters-container']}>
            <ProgressFilters 
                buttonStyle={styles.filter} 
                filters={filter.progress} 
                toggleFilter={toggleProgressFilter} 
            />
            <MembersFilter
                membersFilter={filter.member}
                setMembersFilter={(id, name) => setFilter({ ...filter, member: { id, name } })}
                handleFilterClear={() => setFilter({ ...filter, member: null })}
                buttonStyle={styles.filter}
            />
            <DueDateFilter
                dueBefore={filter.dueBefore}
                buttonStyle={styles.filter}
                onChange={date => setFilter({ ...filter, dueBefore: date })}
                handleFilterClear={() => setFilter({ ...filter, dueBefore: null })}
            />
        </div>
    )
}

export default TaskFilters
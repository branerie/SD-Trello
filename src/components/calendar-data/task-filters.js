import React, { useContext, useRef } from 'react'
import styles from './index.module.css'
import ButtonClean from '../button-clean'
import ButtonCleanDropdown from '../button-clean-dropdown'
import DueDateFilter from '../due-date-filter'
import ProjectContext from '../../contexts/ProjectContext'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

const TaskFilters = ({ filter, setFilter }) => {
    const ref = useRef(null)
    const [isActive, setIsActive] = useDetectOutsideClick(ref)
    const { project } = useContext(ProjectContext)

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

    return (
        <div className={styles['filters-container']}>
            <ButtonClean
                className={isActive 
                            ? `${styles.filter} ${styles['filters-clicked']}` 
                            : styles.filter}
                onClick={() => setIsActive(!isActive)}
                title='Task filters'
            />
            { isActive &&
                <div className={styles.filters} /*ref={ref}*/> 
                    <ButtonClean
                        title={'Not Started'}
                        onClick={() => toggleFilter('notStarted')}
                        className={
                            `${styles.filter} ${styles['filter-option']} ${!filter.bool.notStarted && styles['filter-off']}`
                        }
                    />
                    <ButtonClean
                        title={'In Progress'}
                        className={
                            `${styles.filter} ${styles['filter-option']} ${!filter.bool.inProgress && styles['filter-off']}`}
                        onClick={() => toggleFilter('inProgress')}
                    />
                    <ButtonClean
                        title={'Done'}
                        className={
                            `${styles.filter} ${styles['filter-option']} ${!filter.bool.done && styles['filter-off']}`}
                        onClick={() => toggleFilter('done')}
                    />
                    <ButtonCleanDropdown
                        options={project.membersRoles.map(mr => ({
                            value: mr.memberId._id,
                            displayValue: mr.memberId.username
                        }))}
                        buttonClass={`${styles.filter} ${styles['filter-option']}`}
                        title={(filter.member && filter.member.name) || 'Member'}
                        isAssigned={!!(filter.member)}
                        onOptionClick={setMemberFilter}
                        onOptionClear={() => setFilter({ ...filter, member: null })}
                    />
                    <DueDateFilter
                        dueBefore={filter.dueBefore}
                        buttonStyle={`${styles.filter} ${styles['filter-option']}`}
                        onChange={date => setFilter({ ...filter, dueBefore: date })}
                    />
                </div>
            }
        </div>
    )
}

export default TaskFilters
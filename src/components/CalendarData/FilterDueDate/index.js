import React from 'react'
import DatePicker from 'react-datepicker'
import styles from './index.module.css'
import commonStyles from '../index.module.css'
import FilterWrapper from '../../FilterWrapper'
import { formatDate } from '../../../utils/date'

const DueDateFilter = ({ dueBefore, onChange, handleFilterClear }) => {
    return (
        <FilterWrapper
            legendContent='Tasks due before:'
            isVisible={!!(dueBefore)}
        >
            <DatePicker
                selected={dueBefore}
                customInput={
                    <button 
                        className={`${commonStyles['nav-buttons']} ${commonStyles.filter} ${dueBefore 
                                                                                    ? styles['filter-used'] 
                                                                                    : styles['filter-blank']}`}
                    >
                        {dueBefore ? formatDate(dueBefore, '%d-%m-%Y') : 'Due Before:'}
                    </button>
                }
                showWeekNumbers={true}
                onChange={onChange}
            />
            { dueBefore &&
                <button 
                    className={`${commonStyles['nav-buttons']} ${commonStyles.filter} ${commonStyles['filter-clear']}`}
                    onClick={handleFilterClear}
                >
                    X
                </button>
            }
        </FilterWrapper>
    )
}

export default DueDateFilter
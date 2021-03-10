import React from 'react'
import styles from './index.module.css'
import commonStyles from '../index.module.css'
import DatePicker from 'react-datepicker'
import { formatDate } from '../../../utils/date'
import FilterWrapper from '../../FilterWrapper'

export default function DueDateFilter({ dueBefore, onChange, handleFilterClear }) {
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
import React from 'react'
import styles from './index.module.css'
import DatePicker from 'react-datepicker'
import { formatDate } from '../../utils/date'
import FilterWrapper from '../FilterWrapper'

const DueDateFilter = ({ dueBefore, buttonStyle, onChange, handleFilterClear }) => {
    return (
        <FilterWrapper
            legendContent='Tasks due before:'
            isVisible={!!(dueBefore)}
        >
            <DatePicker
                selected={dueBefore}
                customInput={
                    <button className={dueBefore 
                            ? `${buttonStyle} ${styles['filter-used']}`
                            : `${buttonStyle} ${styles['filter-blank']}`}
                    >
                        {dueBefore ? formatDate(dueBefore, '%d-%m-%Y') : 'Due Before:'}
                    </button>
                }
                showWeekNumbers={true}
                onChange={onChange}
            />
            { dueBefore &&
                <button 
                    className={`${buttonStyle} ${styles['filter-clear']}`}
                    onClick={handleFilterClear}
                >
                    X
                </button>
            }
        </FilterWrapper>
    )
}

export default DueDateFilter
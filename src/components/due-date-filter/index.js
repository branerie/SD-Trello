import React from 'react'
import styles from './index.module.css'
import DatePicker from 'react-datepicker'
import { formatDate } from '../../utils/date'
import FilterWrapper from '../filter-wrapper'

const DueDateFilter = ({ dueBefore, buttonStyle, onChange }) => {
    return (
        <FilterWrapper
            legendContent={
                <>
                    Task due before:
                        <span 
                            className={styles['filter-clear']} 
                            onClick={() => onChange(null)}>
                                (clear)
                        </span>
                </>
            }
            isVisible={!!(dueBefore)}
        >
            <DatePicker
                selected={dueBefore}
                customInput={
                    <button className={buttonStyle}>
                        {dueBefore ? formatDate(dueBefore, '%d-%m-%Y') : 'Due Before'}
                    </button>
                }
                showWeekNumbers={true}
                onChange={onChange}
            />
        </FilterWrapper>
    )
}

export default DueDateFilter
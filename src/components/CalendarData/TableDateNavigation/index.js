import React from 'react'
import DatePicker from 'react-datepicker'
import styles from './index.module.css'
import commonStyles from '../index.module.css'
import { getMonday } from '../../../utils/date'
import previous from '../../../images/project-list/previous-day.svg'
import next from '../../../images/project-list/next-day.svg'

export default function TableDateNavigation({ startDate, changeStartDate, setStartDate }) {
    return (
        <div className={styles.container}>
            <DatePicker
                selected={startDate}
                customInput={
                    <button className={commonStyles['nav-buttons']}>
                        Choose Week
                    </button>
                }
                showWeekNumbers
                onChange={date => setStartDate(getMonday(date))}
            />
            <button className={commonStyles['nav-buttons']} onClick={() => changeStartDate(-7)}>
                Previous week
            </button>

            <div className={styles['pic-container']} onClick={() => changeStartDate(-1)}>
                <img src={previous} alt='previous' />
                <div className={styles['text-centered']}>Previous day</div>
            </div>

            <div className={styles['pic-container']} onClick={() => changeStartDate(1)}>
                <img src={next} alt='next' />
                <div className={styles['text-centered']}>Next day</div>
            </div>

            <button className={commonStyles['nav-buttons']} onClick={() => changeStartDate(7)}>
                Next week
            </button>
        </div>
    )
}
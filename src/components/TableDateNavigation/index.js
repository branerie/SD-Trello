import React from 'react'
import DatePicker from 'react-datepicker'
import styles from './index.module.css'
import { getMonday } from '../../utils/date'
import previous from '../../images/project-list/previous-day.svg'
import next from '../../images/project-list/next-day.svg'

const TableDateNavigation = ({ startDate, changeStartDate, setStartDate }) => {
    return (
        <div className={styles.container}>
            <DatePicker
                selected={startDate}
                customInput={
                    <button className={styles.navigateButtons}>
                        Choose Week
                    </button>
                }
                // className={styles.reactDatepicker}
                showWeekNumbers
                onChange={date => setStartDate(getMonday(date))}
            />
            <button className={styles.navigateButtons} onClick={() => changeStartDate(-7)}>
                Previous week
            </button>

            <div className={styles.picContainer} onClick={() => changeStartDate(-1)}>
                <img
                    className={styles.buttonPreviousDay}
                    src={previous} alt='...'
                />
                <div className={styles.centeredText}>Previous day</div>
            </div>

            <div className={styles.picContainer} onClick={() => changeStartDate(1)}>
                <img
                    className={styles.buttonPreviousDay}
                    src={next} alt='...'
                />
                <div className={styles.centeredText}>Next day</div>
            </div>

            <button
                className={styles.navigateButtons}
                onClick={() => changeStartDate(7)}
            >
                Next week
            </button>
        </div>
    )
}

export default TableDateNavigation
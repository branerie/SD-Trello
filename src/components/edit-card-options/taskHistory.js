import React from 'react'
import styles from './index.module.css'

export default function TaskHistory({ taskHistory }) {

    let arr = []

    if (taskHistory) {
        for (let i = 0; i < taskHistory.length; i++) {
            let currElement = taskHistory[i]

            if (i === taskHistory.length - 1) {
                arr.push(currElement)
                break;
            }

            if (currElement.event.slice(0, 8) === taskHistory[i + 1].event.slice(0, 8) && currElement.date === taskHistory[i + 1].date) {

            } else {
                arr.push(currElement)
            }
        }
    }

    function showDate(currDate) {
        let currDay = new Date(currDate)      
        let date = (('0' + currDay.getDate())).slice(-2) + '.' + ('0' + (currDay.getMonth() + 1)).slice(-2) + '.' + currDay.getFullYear()
        return (date)
    }

    return (
        <div className={styles.history}>
            { taskHistory ?
                arr.reverse().map((m, index) => (
                    <div key={index} >
                        {`${showDate(m['date'])} - ${m['event']}`}
                    </div>
                ))
                : null
            }
        </div>
    )
}


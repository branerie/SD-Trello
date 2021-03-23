import React from 'react'
import styles from './index.module.css'
import { formatDate } from '../../../utils/date'

const TaskHistory = ({ taskHistory }) => {

    return (
        <div className={styles.history}>
            { taskHistory &&
                [...taskHistory]
                    .reverse()
                    .map((m, index) => {
                        return(
                            <div key={index} >
                                {`${formatDate(new Date(m.date), '%d.%m.%Y')} - ${m['event']}`}
                            </div>
                        )})
            }
        </div>
    )
}

export default TaskHistory
import React from 'react'
import styles from './index.module.css'

const ProgressBar = ({ progress }) => {

    const progressColor = (input) => {
        if (Number(input) <= 20) {
            return 'red'
        }
        if (Number(input) <= 40) {
            return 'orange'
        }
        if (Number(input) <= 80) {
            return 'blue'
        }
        if (Number(input) > 80) {
            return 'green'
        }
    }

    return (
        <div className={styles.bar}>
            <div
                style={{
                    width: `${progress}%`,
                    backgroundColor: progressColor(progress)
                }}
                className={styles.progress}
            /></div>
    )
}

export default ProgressBar
import React from 'react'
import styles from './index.module.css'
import getProgressBackgroundColor from '../../utils/getProgressBackgroundColor'

const ProgressBar = ({ progress }) => {

    return (
        <div className={styles.bar}>
            <div
                style={{
                    width: `${progress}%`,
                    backgroundColor: getProgressBackgroundColor(progress)
                }}
                className={styles.progress}
            />
        </div>
    )
}

export default ProgressBar
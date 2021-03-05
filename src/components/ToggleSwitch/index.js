import React from 'react'
import styles from './index.module.css'

const ToggleSwitch = ({ isActive, toggleStatus, label, containerStyle }) => {
    return (
        <div className={`${styles.container} ${containerStyle}`}>
            <label>{label}</label>
            <span 
                className={`${styles['switch-container']} ${isActive && styles['container-active']}`}
                onClick={toggleStatus}
            >
                <span className={styles['state-circle']}></span>
            </span>
        </div>
    )
}

export default ToggleSwitch
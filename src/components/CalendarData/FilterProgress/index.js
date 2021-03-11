import React from 'react'
import styles from './index.module.css'
import commonStyles from '../index.module.css'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import ButtonClean from '../../ButtonClean'
import ToggleSwitch from '../../ToggleSwitch'

export default function ProgressFilters({ filters, toggleFilter }) {
    const [isActive, setIsActive, dropdownRef] = useDetectOutsideClick()

    return (
        <div className={styles.container}>
            <ButtonClean 
                title='Filter By Progress:' 
                className={`${commonStyles.filter} ${commonStyles['nav-buttons']} ${styles['btn-progress']}`}
                onClick={() => setIsActive(!isActive)}
            />
            { isActive &&
            <div className={styles.dropdown} ref={dropdownRef}>
                <ToggleSwitch 
                    isActive={filters.notStarted} 
                    label='Not Started' 
                    toggleStatus={() => toggleFilter('notStarted')}
                    containerStyle={`${styles['progress-switch']} ${styles['progress-switch-top']}`} 
                />
                <ToggleSwitch 
                    isActive={filters.inProgress} 
                    label='In Progress' 
                    toggleStatus={() => toggleFilter('inProgress')}
                    containerStyle={styles['progress-switch']} 
                />
                <ToggleSwitch 
                    isActive={filters.done} 
                    label='Done' 
                    toggleStatus={() => toggleFilter('done')}
                    containerStyle={`${styles['progress-switch']} ${styles['progress-switch-bottom']}`} 
                />
            </div>
            }
        </div>
    )
}
import React, { useRef } from 'react'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import ButtonClean from '../button-clean'
import ToggleSwitch from '../toggle-switch'
import styles from './index.module.css'

const ProgressFilters = ({ buttonStyle, filters, toggleFilter }) => {
    const dropdownRef = useRef(null)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)

    return (
        <div class={styles.container}>
            <ButtonClean 
                title='Filter By Progress:' 
                className={`${buttonStyle} ${styles['btn-progress']}`}
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

export default ProgressFilters
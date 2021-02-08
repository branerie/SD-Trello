import React, { useRef } from 'react'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import ButtonClean from '../button-clean'
import FilterWrapper from '../filter-wrapper'
import styles from './index.module.css'

const ButtonCleanDropdown = ({ options, title, onOptionClick, onOptionClear, isAssigned, buttonClass }) => {
    const dropdownRef = useRef(null)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)

    const handleOptionClick = (optionValue, optionDisplay) => {
        onOptionClick(optionValue, optionDisplay)
        setIsActive(false)
    }

    const handleOptionClear = () => {
        onOptionClear()
        setIsActive(false)
    }

    return (
        <FilterWrapper
            legendContent='Task assigned to:'
            isVisible={isAssigned}
        >
        <div className={styles.container}>
            <ButtonClean
                className={isActive ? `${buttonClass} ${styles['btn-clicked']}` : buttonClass}
                onClick={() => setIsActive(!isActive)}
                title={title}
            />
            {
                isActive &&
                <div className={styles.options} ref={dropdownRef}>
                    <div
                        key='clear options'
                        className={`${styles.option} ${styles['option-blank']}`}
                        onClick={handleOptionClear}
                    >
                        Leave blank
                    </div>
                    {options.map(option => {
                        return (
                            <div
                                key={option.value}
                                className={styles.option}
                                onClick={() => handleOptionClick(option.value, option.displayValue)}
                            >
                                {option.displayValue}
                            </div>
                        )
                    })}
                </div>
            }
        </div>
        </FilterWrapper>
    )
}

export default ButtonCleanDropdown
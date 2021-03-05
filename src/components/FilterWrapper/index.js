import React from 'react'
import styles from './index.module.css'

const FilterWrapper = ({ children, isVisible, legendContent }) => {
    return (
        <fieldset className={styles.container}>
            <legend className={styles['legend-wrapper']}>
                {isVisible && 
                    <blockquote className={styles.legend}>
                        {legendContent}
                    </blockquote>
                }
            </legend>
            {children}
        </fieldset>
    )
}

export default FilterWrapper
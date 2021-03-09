import React from 'react'
import styles from './index.module.css'

const Title = ( {title} ) => {
    return (
    <div className={styles.title}>{title}</div>
    )
}

export default Title
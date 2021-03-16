import React from 'react'
import styles from './index.module.css'

const Transparent = ({ children, hideForm }) => {
    return (
        <>
            <div onClick={hideForm} className={styles.transparent}></div>
                {children}
        </>
    )
}

export default Transparent

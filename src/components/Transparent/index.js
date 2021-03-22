import React from 'react'
import styles from './index.module.css'

const Transparent = ({ hideForm, children }) => {
    return (
        <>
            <div onClick={hideForm} className={styles.transparent}></div>
            {children}
        </>
    )
}

export default Transparent

import React from 'react'
import styles from './index.module.css'

export default function Alert(props) {
    return (
        <div>
            {props.alert ? (<div className={styles.alert}>
                {props.message}
            </div>) : null}
        </div>
    )
}

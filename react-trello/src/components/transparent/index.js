import React, { useState } from 'react'
import styles from './index.module.css'

const Transparent = (props) => {
    return (
    <>
    <div onClick={props.hideForm} className={styles.transparent}></div>
    {props.children}
    </>
    )
}

export default Transparent

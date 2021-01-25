import React from 'react'
import styles from './index.module.css'

const ListName = ({ index, color, name, onClick }) => {
    return (
        <div
            key={index}
            className={styles.listNameContainer}
            style={{ background: color || '#A6A48E' }}
            onClick={onClick}
        >
            <span className={styles.listNameText} >
                {name}
            </span>
        </div>
    )
}

export default ListName
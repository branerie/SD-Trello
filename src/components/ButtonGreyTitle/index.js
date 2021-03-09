import React from 'react';
import styles from './index.module.css';

const ButtonGreyTitle = ( { title, onClick, className } ) => {
    return (
    <button onClick={onClick} className={`${styles.button} ${className}`} title={title} >{title}</button>
    )
}

export default ButtonGreyTitle
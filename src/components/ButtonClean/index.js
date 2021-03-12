import React from 'react';
import styles from './index.module.css';

const ButtonClean = ({ title, onClick, type, className, children, style }) => {
    return (
        <button
            type={type || 'button'}
            onClick={onClick}
            className={`${styles.clean} ${className}`}
            style={style}
        >
            {title}{children}
        </button>
    )
}

export default ButtonClean
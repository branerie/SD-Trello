import React from "react";
import styles from "./index.module.css";

const ButtonClean = ( { title, onClick, type, className } ) => {
    return (
        <button type={type || 'button'} onClick={onClick} className={`${styles.clean} ${className}`}>{title}</button>
    )
}

export default ButtonClean
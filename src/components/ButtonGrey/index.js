import React from "react";
import styles from "./index.module.css";

const ButtonGrey = ( { title, onClick, className } ) => {
    return (
    <button onClick={onClick} className={`${styles.button} ${className}`}>{title}</button>
    )
}

export default ButtonGrey
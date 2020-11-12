import React from "react";
import styles from "./index.module.css";

const Button = ( { title, onClick } ) => {
    return (
    <button type="submit" onClick={onClick} className={styles.submit}>{title}</button>
    )
}

export default Button;
import React from "react";
import styles from "./submit-button.module.css";

const SubmitButton = ( { title, onClick } ) => {
    return (
    <button type="submit" onClick={onClick} className={styles.submit}>{title}</button>
    )
}

export default SubmitButton;
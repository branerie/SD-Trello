import React from "react";
import styles from "./index.module.css";
import { Link } from "react-router-dom";

const LinkAside = ({ title, href }) => {
    return (
            <Link to={href} className={styles.link}>
                {title}
            </Link>
    )
}

export default LinkAside;
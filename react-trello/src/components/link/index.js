import React from "react";
import styles from "./index.module.css";
import { Link } from "react-router-dom";

const LinkComponent = ({ title, href, className }) => {
    return (
            <Link to={href} className={`${styles.link} ${className}`}>
                {title}
            </Link>
    )
}

export default LinkComponent;
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

const LinkComponentTitle = ({ title, href, className, onClick }) => {
    return (
            <Link 
                to={href}
                className={`${styles.link} ${className}`}
                onClick={onClick}
                title={title} 
            >
                {title}
            </Link>
    )
}

export default LinkComponentTitle
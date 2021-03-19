import React, { useState } from 'react'
import styles from './index.module.css'
import Aside from '../Aside'
import Header from '../Header'

const PageLayout = ({ children, contentClassName }) => {
    const [isAsideOn, setIsAsideOn] = useState(false)

    return (
        <div className={styles.app}>
            <Aside isAsideOn={isAsideOn} setIsAsideOn={setIsAsideOn} />
            <Header isAsideOn={isAsideOn} />
            <div className={contentClassName ? contentClassName : `${styles.content} ${isAsideOn && styles.small}`}>
                {children}
            </div>
        </div>
    )
}

export default PageLayout
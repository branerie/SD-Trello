import React, { useState } from 'react'
import Aside from '../Aside'
import Header from '../Header'
import styles from './index.module.css'

const PageLayout = ({ children, contentClassName }) => {
  const [asideOn, setAsideOn] = useState(false)

  return (
    <div className={styles.app}>
      <Aside asideOn={asideOn} setAsideOn={setAsideOn} />
      <Header asideOn={asideOn} />
      <div 
        className={contentClassName ? contentClassName : `${styles.content} ${asideOn ? styles.small : ''}`}
      >
        {children}
      </div>
    </div>
  )
}

export default PageLayout
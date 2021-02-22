import React, { useState } from 'react'
import Aside from '../aside'
import Header from "../header"
import styles from "./index.module.css"

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
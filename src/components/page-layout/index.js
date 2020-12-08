import React, { useState } from 'react'
import Aside from '../aside'
import Header from "../header"
import styles from "./index.module.css"

const PageLayout = (props) => {
  const [asideOn, setAsideOn] = useState(false)

  return (
    <div className={styles.app}>
      <Aside asideOn={asideOn} setAsideOn={setAsideOn} />
      <Header asideOn={asideOn} />
      <div className={`${styles.content} ${asideOn ? styles.small : ''}`} >
        {props.children}
      </div>
    </div>
  )
}

export default PageLayout
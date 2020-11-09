import React from 'react';
import Header from "../header";
import styles from "./index.module.css";

const PageLayout = (props) => {
  return (
    <div className={styles.app}>
        <Header username={props.username}/>
        <div className={styles.container}>
          {props.children}
        </div>
    </div>
  )
}

export default PageLayout;

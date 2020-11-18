import React from 'react';
import Aside from '../aside';
import Header from "../header";
import styles from "./index.module.css";

const PageLayout = (props) => {
  return (
    <div className={styles.app}>
      <Aside />
      <div className={styles.content}>
        <Header username={props.username} />
        <div className={styles.container}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default PageLayout;

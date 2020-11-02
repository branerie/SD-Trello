import React from 'react';
import Header from "../header";
import styles from "./index.module.css";
// import Footer from '../footer';

const PageLayout = (props) => {
  return (
    <div className={styles.app}>
        <Header />
        <div className={styles.container}>
          {props.children}
        </div>
        {/* <Footer /> */}
    </div>
  );
}

export default PageLayout;

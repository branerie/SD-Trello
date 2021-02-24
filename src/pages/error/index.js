import React from "react";
import PageLayout from "../../components/page-layout";
import styles from './index.module.css'
import pic1 from '../../images/error-page.svg'



const ErrorPage = () => {
    return (
        <PageLayout>
            <div className={styles.title}>Error Page</div>
        <div>
          <img className={styles.pic1} src={pic1} alt="" />
        </div>
            <div className={styles.text}>
                Something went wrong.
            </div>
        </PageLayout>
    )
}

export default ErrorPage;
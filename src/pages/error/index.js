import React from "react";
import PageLayout from "../../components/page-layout";
import styles from './index.module.css'


const ErrorPage = () => {
    return (
        <PageLayout>
            <div className={styles.title}>Error Page</div>

            <div className={styles.text}>
                Something went wrong.
            </div>
        </PageLayout>
    )
}

export default ErrorPage;
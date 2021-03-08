import React from 'react'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import pic1 from '../../images/error-page.svg'



export default function ErrorPage() {
    return (
        <PageLayout>
            <div className={styles.title}>Error Page</div>

            <img className={styles.pic1} src={pic1} alt="" />

            <div className={styles.text}>Something went wrong.</div>
        </PageLayout>
    )
}



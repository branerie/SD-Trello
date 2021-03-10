import React from 'react'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import errorPic from '../../images/error-page.svg' 

const ErrorPage = () => {
    
    return (
        <PageLayout>
            <div className={styles.title}>Error Page</div>

            <img className={styles.errorPic} src={errorPic} alt='' /> 

            <div className={styles.text}>Something went wrong.</div>
        </PageLayout>
    )
}

export default ErrorPage

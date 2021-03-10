import React from 'react'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import pic1 from '../../images/error-page.svg' // REVIEW: не е мн описателно pic1. errorPic или нещо такова?
/* REVIEW:  Като цяло няма смисъл да се оставя повече от един свободен ред някъде (а тук има 3) */


const ErrorPage = () => {
    return (
        <PageLayout>
            <div className={styles.title}>Error Page</div>
            {/* REVIEW: и за css не е много описателно styles.pic1 */}
            <img className={styles.pic1} src={pic1} alt='' /> 

            <div className={styles.text}>Something went wrong.</div>
        </PageLayout>
    )
}

export default ErrorPage

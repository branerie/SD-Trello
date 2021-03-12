import React, { useState } from 'react'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import Transparent from '../../components/Transparent'
import CreateTeam from '../../components/CreateTeam'
import ButtonGreyTitle from '../../components/ButtonGreyTitle'
import logo from '../../images/logo.svg'
import getStartedPagePic1 from '../../images/get-started/pic1.svg'
import getStartedPagePic2 from '../../images/get-started/pic2.svg'
import getStartedPagePic3 from '../../images/get-started/pic3.svg'
import getStartedPagePic4 from '../../images/get-started/pic4.svg'



const GetStarted = () => {
    const [isTeamFormShown, setIsTeamFormShown] = useState(false)


    return (
        <PageLayout>
            <>
                {
                    isTeamFormShown &&
                    <Transparent hideForm={() => setIsTeamFormShown(false)}>
                        <CreateTeam hideForm={() => { setIsTeamFormShown(false) }} />
                    </Transparent>
                }
            </>

            <div className={styles.container}>
                <div className={styles['logo-div']}>
                    <img className={styles.logo} src={logo} alt='' />
                </div>

                <div className={styles.title}>
                    Welcome to Smart Manager
                </div>

                <div className={styles.title}>
                    Get to know how to use Smart Manager in few quick steps:
                </div>

                <div className={styles.paragraph}>
                    1. - In order to start using Smart Manager you have to be part of a team - you can create your own and work by yourself,  invite your colleagues and friends or can be invited in others by other smart manager users.
                    You can create and join as many teams you want.
                    <div className={styles['pic-div']}>
                        <img className={styles.pic} src={getStartedPagePic1} alt='' />
                    </div>
                </div>

                <div className={styles.paragraph}>
                    2. - When you are already part of a team you can create and join different projects - again as many as you need. In your projects you can add your teammates and work together or you can organize your tasks by yourself.
                    <div className={styles['pic-div']}>
                        <img className={styles.pic} src={getStartedPagePic2} alt='' />
                    </div>
                </div>

                <div className={styles.paragraph}>
                    3. - In each project you can organize your tasks by separating them into different lists - for example - To Do, Doing and Done or any other way. You can create as many lists you need. The tasks can be moved from one list to another or within the lists.
                    <div className={styles['pic-div']}>
                        <img className={styles.pic3} src={getStartedPagePic3} alt='' />
                    </div>
                </div>

                <div className={styles.paragraph}>
                    4. - You can create as many tasks you need which gives you endless opportunities to keep track of the work you are doing. You can assign people for each task, select a due date and fill the progress as you work. You can attach files for each task and also keep track of the progress with task history.
                    <div className={styles['pic-div']}>
                        <img className={styles.pic} src={getStartedPagePic4} alt='' />
                    </div>
                </div>

                <div className={styles.paragraph}>
                    5. - Great! You are all set. Start your Smart experience and continue exploring countless opportunities by creating your first team.
                    <div>
                        <ButtonGreyTitle className={styles['navigate-buttons']} title={'Create New Team'} 
                        onClick={() => setIsTeamFormShown(true)} />
                    </div>
                </div>

                <div className={styles.greeting}>
                    Enjoy!                
                    <div >
                    Smart Manager Team
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default GetStarted
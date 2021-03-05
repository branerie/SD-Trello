import React, { useState } from "react";
import PageLayout from "../../components/page-layout";
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import pic1 from '../../images/get-started/pic1.svg'
import pic2 from '../../images/get-started/pic2.svg'
import pic3 from '../../images/get-started/pic3.svg'
import pic4 from '../../images/get-started/pic4.svg'
import Transparent from "../../components/transparent";
import CreateTeam from "../../components/create-team";
import ButtonGreyTitle from "../../components/button-grey-title";



const GetStarted = () => {
    const [showTeamForm, setShowTeamForm] = useState(false)





    return (
        <PageLayout>
            <div>
                {
                    showTeamForm ? (<Transparent hideForm={() => setShowTeamForm(false)}>
                        <CreateTeam hideForm={() => { setShowTeamForm(false) }} ></CreateTeam>
                    </Transparent>) : null
                }
            </div>


            <div className={styles.container}>
                <div className={styles['logo-div']}>
                    <img className={styles.logo} src={logo} alt="" />
                </div>

                <div className={styles.title}>

                    Welcome to Smart Manager

            </div>

                <div className={styles.title}>
                    Get to know how to use Smart Manager in few quick steps:
            </div>

                <div className={styles.paragraph}>
                    1. - In order to start using Smart Manager you have to be part of a team - you can create your own and work by yourself,  invite your colleagues and friends or can be invited in others by another smart manager users.
                    You can create and join as many teams you want.

                    <div className={styles['pic-div']}>
                        <img className={styles.pic} src={pic1} alt="" />
                    </div>
                </div>

                <div className={styles.paragraph}>
                    2. - When you are already part of a team you can create and join different projects - again as many as you need. In your projects you can add your teammates and work together or you can organize your tasks by yourself.

                    <div className={styles['pic-div']}>
                        <img className={styles.pic} src={pic2} alt="" />
                    </div>
                </div>

                <div className={styles.paragraph}>
                    3. - In each project you can organize your tasks by separating them into different lists - for example - To Do, Doing and Done or any other way. You can create as many lists you need. The tasks can be moved from one list to another or within the lists.

                    <div className={styles['pic-div']}>
                        <img className={styles.pic3} src={pic3} alt="" />
                    </div>
                </div>

                <div className={styles.paragraph}>
                    4. - You can create as many tasks you need which gives you endless opportunities to keep track of the work you are doing. You can assign people for each task, select a due date and fill the progress as you work. You can attach files for each task and also keep track of the progress with task history.

                    <div className={styles['pic-div']}>
                        <img className={styles.pic} src={pic4} alt="" />
                    </div>
                </div>



                <div className={styles.paragraph}>
                    5. - Great! You are all set. Start your Smart experience and continue exploring countless opportunities by creating your first team.

                    <div>
                    <ButtonGreyTitle className={styles['navigate-buttons']} title={'Create New Team'} onClick={() => setShowTeamForm(true)} />

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

export default GetStarted;
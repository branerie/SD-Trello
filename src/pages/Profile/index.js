import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styles from './index.module.css'
import PageLayout from '../../components/PageLayout'
import Loader from 'react-loader-spinner'
import Title from '../../components/Title'
import UserContext from '../../contexts/UserContext'
import useUserServices from '../../services/useUserServices'
import profilePagePic from '../../images/profile-page-pic.svg'
import UpdateUserData from '../../components/UpdateUserData'
import UpdateUserImage from '../../components/UpdateUserImage'


const ProfilePage = () => {
    const { userid } = useParams()
    const { user } = useContext(UserContext)
    const [userEmail, setUserEmail] = useState(null)
    const { getUser } = useUserServices()
    const username = user.username


    const getData = useCallback(async () => {
        const user = await getUser(userid)
        setUserEmail(user.email)
    }, [getUser, userid])

    useEffect(() => {
        getData()
    }, [getData])   

    return (
        <PageLayout>
            {!username ?
                <Loader
                    type='TailSpin'
                    color='#363338'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
                :
                <>
                    <Title title='Profile' />
                    <div className={styles.container}>
                        <div className={styles['inputs-container']}>
                            <UpdateUserData user={user} userEmail={userEmail} getData={getData} />
                        </div>

                        <div className={styles['pic-container']}>
                            <UpdateUserImage user={user} getData={getData} />

                            <img className={styles.pic1} src={profilePagePic} alt='' />
                        </div>
                    </div>
                </>
            }
        </PageLayout>
    )
}

export default ProfilePage;
import React, { useContext } from 'react'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import AvatarUser from '../AvatarUser'
import { useHistory } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'

export default function ProfileDropdown() {
    const history = useHistory()
    const context = useContext(UserContext)
    const [isProfileActive, setIsProfileActive, profileRef] = useDetectOutsideClick()

    return (<div className={styles['dropdown-container']}>
        <ButtonClean
            className={styles.avatar}
            onClick={() => setIsProfileActive(!isProfileActive)}
            title={<AvatarUser user={context.user} size={40} />}
        />
        {isProfileActive &&
            <div
                ref={profileRef}
                className={`${styles.dropdown} ${styles.profile}`}
            >
                <ButtonClean
                    title='Profile'
                    className={`${styles.options} ${styles.profile}`}
                    onClick={() => history.push(`/profile/${context.user && context.user.id}`)}
                />

                <ButtonClean
                    onClick={context.logOut}
                    title='Log Out'
                    className={`${styles.options} ${styles['last-option']} ${styles.profile}`}
                />
            </div>
        }
    </div>)
}

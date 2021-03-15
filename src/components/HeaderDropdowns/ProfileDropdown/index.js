import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../../../contexts/UserContext'
import commonStyles from '../index.module.css'
import styles from './index.module.css'
import ButtonClean from '../../ButtonClean'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import AvatarUser from '../../AvatarUser'

const ProfileDropdown = () => {
    const { user, logOut }= useContext(UserContext)
    const [isProfileActive, setIsProfileActive, profileRef] = useDetectOutsideClick()
    const history = useHistory()

    return (
        <div className={commonStyles['dropdown-container']}>
            <ButtonClean
                className={styles.avatar}
                onClick={() => setIsProfileActive(!isProfileActive)}
                title={<AvatarUser user={user} size={40} />}
            />
            {isProfileActive &&
                <div
                    ref={profileRef}
                    className={`${commonStyles.dropdown} ${styles.profile}`}
                >
                    <ButtonClean
                        title='Profile'
                        className={`${commonStyles.options} ${styles.profile}`}
                        onClick={() => history.push(`/profile/${user && user.id}`)}
                    />
                    <ButtonClean
                        onClick={logOut}
                        title='Log Out'
                        className={`${commonStyles.options} ${commonStyles['last-option']} ${styles.profile}`}
                    />
                </div>
            }
        </div>
    )
}

export default ProfileDropdown
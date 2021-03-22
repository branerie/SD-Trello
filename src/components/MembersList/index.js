import React, { useMemo } from 'react'
import Avatar from 'react-avatar'
import styles from './index.module.css'
import AvatarUser from '../AvatarUser'
import ShowAllTaskMembers from '../ShowAllTaskMembers'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

const MembersList = ({ members, maxLength, deleteMemberOption, deleteMemberObj }) => {
    const [isActive, setIsActive, ref] = useDetectOutsideClick()
    const shownMembers = useMemo(() => (members.length > maxLength) ? members.slice(0, maxLength - 1) : members, [members, maxLength])

    return (
        <div
            className={styles.members}
            onClick={() => setIsActive(true)}
            ref={ref}
        >
            { isActive &&
                <ShowAllTaskMembers
                    members={members}
                    deleteMemberOption={deleteMemberOption}
                    deleteMemberObj={deleteMemberObj}
                />
            }
            {shownMembers.map(member => {
                return (
                    <span className={styles.avatar} key={member._id}>
                        <AvatarUser user={member}
                            size={30}
                            className={styles.avatar}
                        />
                    </span>
                )
            })}
            {(members.length > maxLength) &&
                <span className={styles.avatar}>
                    <Avatar
                        color={'grey'}
                        // split number of remaining members (and + sign) with spaces in b/n
                        // so that they are correctly displayed by the Avatar component
                        name={['+', ...(`${members.length - maxLength + 1}`.split(''))].join(' ')}
                        size={30}
                        round={true}
                        maxInitials={3}
                        className={styles.avatar}
                    />
                </span>
            }

        </div>
    )
}

export default MembersList
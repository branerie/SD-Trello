import React, { useRef } from 'react'
import Avatar from 'react-avatar'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import AvatarUser from '../avatar-user'
import ShowAllTaskMembers from '../show-all-task-members'
import styles from './index.module.css'

const MembersList = ({ members, maxLength, deleteMemberOption, deleteMemberObj }) => {
    const ref = useRef(null)
    const [isActive, setIsActive] = useDetectOutsideClick(ref)

    maxLength = Math.min(maxLength, members.length)

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
                    setCurrCard
                />
            }
            {(members.length > maxLength) ?
                <>
                    {members.slice(0, maxLength - 1).map(member => {
                        return (
                            <span 
                            className={styles.avatar} 
                            key={member._id}>
                                <AvatarUser user={member}
                                    size={30}
                                    className={styles.avatar}
                                />
                            </span>
                        )
                    })}
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
                </>
                :
                <>
                    {members.map(element => {
                        return (
                            <span className={styles.avatar} key={element._id}>
                                <AvatarUser
                                user={element}
                                    key={element._id}
                                    size={30}                                  
                                />
                            </span>
                        )
                    })}
                </>
            }
        </div>
    )
}

export default MembersList
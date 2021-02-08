import React, { useRef } from 'react'
import Avatar from 'react-avatar'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import ShowAllTaskMembers from '../show-all-task-members'
import styles from './index.module.css'

const MembersList = ({ members, maxLength, maxDisplayLength }) => {
    const ref = useRef(null)
    const [isActive, setIsActive] = useDetectOutsideClick(ref)

    maxDisplayLength = Math.min(maxDisplayLength, members.length - 1)
    maxLength = Math.min(maxLength, members.length)

    return (
        <div 
            className={styles.members} 
            onClick={() => setIsActive(true)}
            ref={ref}
        >
            { isActive && <ShowAllTaskMembers members={members} />}
            {(members.length > maxLength) ?
                <>
                    {members.slice(0, maxDisplayLength).map(member => {
                        return (
                            <span className={styles.avatar} key={member._id}>
                                <Avatar
                                    key={member._id}
                                    name={member.username}
                                    size={30}
                                    round={true}
                                    maxInitials={2}
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
                            name={['+', ...(`${members.length - maxDisplayLength}`.split(''))].join(' ')}
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
                                <Avatar
                                    key={element._id}
                                    name={element.username}
                                    size={30}
                                    round={true}
                                    maxInitials={2}
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
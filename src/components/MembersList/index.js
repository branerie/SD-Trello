import React from 'react'
import Avatar from 'react-avatar'
import styles from './index.module.css'
import AvatarUser from '../AvatarUser'
import ShowAllTaskMembers from '../ShowAllTaskMembers'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

const MembersList = ({ members, maxLength, deleteMemberOption, deleteMemberObj }) => {
    const [isActive, setIsActive, ref] = useDetectOutsideClick()

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
                    setCurrCard // REVIEW: Това не разбирам какво е. Може би е останало след някоя промяна?
                />
            }
            {/* REVIEW: Тук ако members.length не е > maxLength, то members.length === maxLength (няма как да е по-малко).
                И при двата варианта members.slice(0, maxLength - 1).map(...) би трябвало да върне правилният резултат. 
                Съответно, проверката members.length > maxLength може да се премести надолу и да влияе само на това дали
                span-a с Avatar color={'grey'}... се изкарва
            */}
            {(members.length > maxLength) ?
                <>
                    {members.slice(0, maxLength - 1).map(member => {
                        return (
                            <span className={styles.avatar} key={member._id}>
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
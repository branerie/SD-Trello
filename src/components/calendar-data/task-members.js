import React from 'react'
import styles from './index.module.css'
import Avatar from 'react-avatar'
import AvatarUser from '../avatar-user'


export default function TaskMembers(props) {

    const value = props.value

    return (
        <div>
            {(value.length > 3) ?
                <div className={styles.membersContainer}>
                    <span className={styles.membersDiv}>
                        {
                            value.slice(0, 3).map((member, index) => {
                                return (
                                    <span key={index}>
                                        <AvatarUser user={member} size={props.size} />
                                    </span>
                                )
                            })
                        }
                        <span >
                            <Avatar color={'grey'} name={`+   ${value.length - 3} ${('0' + (value.length - 3)).slice(2)}`} size={props.size} round={true} maxInitials={3} />
                        </span>
                    </span>
                </div >
                :
                <div className={styles.membersContainer}>
                    <span className={styles.membersDiv}>
                        {
                            value.map((member, index) => {
                                return (
                                    <span key={index}>
                                        <AvatarUser user={member} size={props.size} />
                                    </span>
                                )
                            })
                        }
                    </span>
                </div >

            }
        </div>
    )
}


import React from 'react'
import Avatar from 'react-avatar'
import styles from './index.module.css'


export default function ShowAllTaskMembers(props) {
    const members = props.members

    return (
        <div className={styles.containerMemb}>
            <div className={styles.allCardMembers}>
            {
                members.map((m, index) => {
                    return (
                        <div key={index} className={styles.eachMember}>
                            <span className={styles.avatar} key={m._id}>
                                                <Avatar key={m._id}
                                                    name={m.username}
                                                    size={30}
                                                    round={true}
                                                    maxInitials={2}
                                                    className={styles.avatar}
                                                />
                                            </span>
                            <span>{m.username}</span>
                            </div>
                    )
                })
            }
            </div>
        </div>
    )
}







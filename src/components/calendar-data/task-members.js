import React from 'react'
import styles from './index.module.css'
import Avatar from 'react-avatar'



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
                                        <Avatar name={member.username} size={props.size} round={true} maxInitials={2} />
                                    </span>
                                )
                            })
                        }
                        <span >
                            <Avatar color={'grey'} name={`+   ${value.length - 3}`} size={props.size} round={true} maxInitials={3} />
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
                                        <Avatar name={member.username} size={props.size} round={true} maxInitials={2} />
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


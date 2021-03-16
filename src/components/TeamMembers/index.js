import React from 'react'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import AvatarUser from '../AvatarUser'


const TeamMembers = ({ members, invited }) => {


    return (
        <div>
            <div className={styles['members-avatars']}>
                <div>
                    Team Members:
                </div>
                {
                    members.map((member, index) => {
                        return (
                            <ButtonClean
                                key={index}
                                title={<AvatarUser user={member} size={40} />}
                            />
                        )
                    })
                }
            </div>
            {
                invited.length !== 0 &&
                <div className={styles['members-avatars']}>
                    <div>
                        Invited Members:
                    </div>
                    {
                        invited.map((member, index) => {
                            return (
                                <span key={index}>
                                    <AvatarUser user={member} size={40} />
                                </span>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default TeamMembers

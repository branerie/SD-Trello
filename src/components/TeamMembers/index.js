import React from 'react'
import styles from './index.module.css'
import ButtonClean from "../ButtonClean"
import AvatarUser from '../AvatarUser'


export default function TeamMembers(props) {

    const members = props.members
    const invited = props.invited

    return (
        <div>
            <div className={styles['members-avatars']}>
                <div>
                    Team Members:
                </div>
                {
                    members.map((m, index) => {
                        return (
                            <ButtonClean
                                key={index}
                                title={
                                    <AvatarUser user={m}
                                        size={40}
                                    />}
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
                        invited.map((m, index) => {
                            return (
                                <span key={index}>
                                <AvatarUser user={m}
                                   
                                    size={40}
                                // onClick={() => { if (window.confirm('Are you sure you wish to delete this member?')) removeMember(m) }}
                                />
                                </span>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

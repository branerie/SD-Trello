import React from 'react'
import styles from './index.module.css'
import Avatar from 'react-avatar'
import ButtonClean from "../../components/button-clean"


export default function TeamMembers(props) {

    const members = props.members
    const invited = props.invited

    return (
        <div>
            <div className={styles.membersAvatars}>
                <div>
                    Team Members:
                </div>
                {
                    members.map((m, index) => {
                        return (
                            <ButtonClean
                                key={index}
                                title={<Avatar
                                    key={m._id}
                                    name={m.username}
                                    size={40}
                                    round={true}
                                    maxInitials={2}
                                />}
                            />
                        )
                    })
                }
            </div>
            {
                invited.length !== 0 &&
                <div className={styles.membersAvatars}>
                    <div>
                        Invited Members:
                        </div>
                    {
                        invited.map((m, index) => {
                            return (
                                <Avatar
                                    key={index}
                                    name={m.username}
                                    size={40}
                                    round={true}
                                    maxInitials={2}
                                // onClick={() => { if (window.confirm('Are you sure you wish to delete this member?')) removeMember(m) }}
                                />
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

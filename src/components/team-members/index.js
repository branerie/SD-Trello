import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './index.module.css'
import Avatar from 'react-avatar'
import ButtonClean from "../../components/button-clean"
import TeamContext from "../../contexts/TeamContext"



export default function TeamMembers(props) {

    const teamContext = useContext(TeamContext)
    const [members, setMembers] = useState([])
    const [invited, setInvited] = useState([])

    const teamId = props.teamId


    const getData = useCallback(async () => {

        let currTeam = {}
        await teamContext.getCurrentProjects(teamId)
        await teamContext.teams.map(t => {
            if (t._id === teamId) {
                currTeam = t
            }
        })

        setMembers(currTeam.members)
        setInvited(currTeam.requests)
       
    }, [teamId])


    useEffect(() => {
        getData()
    }, [getData])









    return (
        <div>
            <div className={styles.membersAvatars}>
                <div>
                    Team Members:
            </div>
                {
                    members.map(m => {
                        return (
                            <ButtonClean
                                title={<Avatar key={m._id} name={m.username} size={40} round={true} maxInitials={2} />}
                            />

                        )
                    })
                }
            </div>
            {
                (invited.length !== 0) ?

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
                                        size={40} round={true} maxInitials={2}
                                    // onClick={() => { if (window.confirm('Are you sure you wish to delete this member?')) removeMember(m) }}
                                    />

                                )
                            })
                        }
                    </div>
                    :
                    null
            }
        </div>
    )
}

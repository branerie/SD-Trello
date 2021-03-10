import React from 'react'
import styles from './index.module.css'


const MyTeamsMenu = ({ userTeams, goToTeamPage }) => {





    return (
        <div className={styles['teams-container']}>
            {
                userTeams.length > 0 ?
                    userTeams.map((team, index) => {
                        return (

                            <div key={index}
                                className={styles['buttons-teams']}
                                onClick={() => goToTeamPage(team._id)}
                                title={team.name}
                            >
                                {team.name}
                            </div>


                        )
                    }
                    )
                    : 'You have not joined any teams yet'
            }
        </div>
    )
}

export default MyTeamsMenu

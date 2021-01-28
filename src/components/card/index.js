import React, { useState } from 'react'
import styles from './index.module.css'
import pen from '../../images/pen.svg'
import ButtonClean from '../button-clean'
import ShowAllTaskMembers from '../show-all-task-members'
import MembersList from '../members-list'

export default function Card({ card, showEditCard }) {

    const [avatarsHover, setAvatarsHover] = useState(false)

    const progressColor = (progress) => {
        if (Number(progress) <= 20) {
            return 'red'
        }
        if (Number(progress) <= 40) {
            return 'orange'
        }
        if (Number(progress) <= 80) {
            return 'blue'
        }
        if (Number(progress) > 80) {
            return 'green'
        }
    }

    // const onHoverAvatars = (members) => {

    //     console.log(members);

    //     return(
    //         <div className={styles.allCardMembers}>
    //             {
    //                 members.map((m,index) => {
    //                     return (
    //                         <div key={index}>{m.username}</div>
    //                     )
    //                 })
    //             }
    //         </div>
    //     )
    // }

    return (

        <div className={styles.card} onMouseLeave={() => setAvatarsHover(false)}>
            { avatarsHover && <ShowAllTaskMembers members={card.members} /> }
            <div className={styles.leftSide}>
                <div className={styles.cardName}>{card.name}</div>
                {
                    card.progress ?
                        <div className={styles.bar} >
                            <div
                                style={{
                                    width: `${card.progress}%`,
                                    backgroundColor: progressColor(card.progress)
                                }}
                                className={styles.progress}
                            />
                        </div> : null
                }
            </div>

            <div className={styles.flex}>
                <MembersList 
                    members={card.members} 
                    maxLength={3}
                    maxDisplayLength={1} 
                    onClick={() => setAvatarsHover(true)} 
                />
                <ButtonClean
                    className={styles.pen}
                    onClick={() => showEditCard()}
                    title={<img src={pen} alt="..." width="11.5" height="11.5" />}
                />
            </div>
        </div >

    )
}
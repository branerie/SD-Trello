import React, { useState } from 'react'
import styles from './index.module.css'
import pen from '../../images/pen.svg'
import ButtonClean from '../button-clean'
import Avatar from 'react-avatar'
import ShowAllTaskMembers from '../show-all-task-members'

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

        <div className={styles.card}
            onMouseLeave={() => setAvatarsHover(false)}
        >
            {
                avatarsHover ?

                    <ShowAllTaskMembers members={card.members} />

                    : null
            }
            <div className={styles.leftSide}>
                <div className={styles.cardName}>{card.name}</div>
                {
                    card.progress &&
                    <div className={styles.bar} >
                        <div
                            style={{
                                width: `${card.progress}%`,
                                backgroundColor: progressColor(card.progress)
                            }}
                            className={styles.progress}
                        />
                    </div>
                }
            </div>

            <div className={styles.flex}>
                {
                    (card.members.length > 3) ?
                        <div >
                            <div className={styles.members} onClick={() => setAvatarsHover(true)}>
                                {card.members.slice(0, 1).map(element => {
                                    return (
                                        <span className={styles.avatar} key={element._id}>
                                            <Avatar key={element._id}
                                                name={element.username}
                                                size={30}
                                                round={true}
                                                className={styles.avatar}
                                            />
                                        </span>
                                    )
                                })}
                                <span className={styles.avatar}>
                                    <Avatar color={'grey'} name={`+   ${(card.members.length - 1)} ${('0' + (card.members.length - 1)).slice(2)}`} size={30} round={true} maxInitials={3} className={styles.avatar}
                                    />
                                </span>
                            </div>

                        </div>
                        :
                        <div className={styles.members} onClick={() => setAvatarsHover(true)}>
                            {card.members.map(element => {
                                return (
                                    <span className={styles.avatar} key={element._id}>
                                        <Avatar key={element._id} name={element.username} size={30} round={true} maxInitials={2} />
                                    </span>
                                )
                            })}
                        </div>
                }
                <div>

                </div>
                <ButtonClean
                    className={styles.pen}
                    onClick={() => showEditCard()}
                    title={<img src={pen} alt="..." width="11.5" height="11.5" />}
                />
            </div>
        </div >

    )
}
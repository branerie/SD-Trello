import React from 'react'
import styles from './index.module.css'
import pen from '../../images/pen.svg'
import ButtonClean from '../button-clean'
import Avatar from 'react-avatar'

export default function Card({ card, showEditCard }) {

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

    return (
        <div className={styles.card} >
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
                {(card.members.length > 3) ?
                    <div className={styles.members}>
                        {card.members.slice(0, 3).map(element => {
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
                            <Avatar color={'grey'} name={`+   ${card.members.length - 3} ${('0' + (card.members.length - 3)).slice(2)}`} size={30} round={true} maxInitials={3} className={styles.avatar} />
                        </span>
                    </div>
                    :
                    <div className={styles.members}>
                        {card.members.map(element => {
                            return (
                                <span className={styles.avatar} key={element._id}>
                                    <Avatar key={element._id} name={element.username} size={30} round={true} maxInitials={2} />
                                </span>
                            )
                        })}
                    </div>
                }
                <ButtonClean
                    className={styles.pen}
                    onClick={() => showEditCard()}
                    title={<img src={pen} alt="..." width="11.5" height="11.5" />}
                />
            </div>
        </div >
    )
}
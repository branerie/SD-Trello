import React from 'react'
import styles from './index.module.css'
import pen from '../../images/pen.svg'
import ButtonClean from '../button-clean'
import MembersList from '../members-list'

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

        <div className={styles.card}>
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
                    maxLength={2}
                />
                <ButtonClean
                    className={styles.pen}
                    onClick={() => showEditCard()}
                    title={<img src={pen} alt="" width="11.5" height="11.5" />}
                />
            </div>
        </div >

    )
}
import React, { useState } from 'react'
import EditCard from '../edit-card'
import Transparent from '../transparent'
import styles from './index.module.css'
import pen from '../../images/pen.svg'
import ButtonClean from '../button-clean'
import Avatar from 'react-avatar'

export default function Card(props) {

    const [isVisible, setIsVisible] = useState(false)



    const card = props.card
    // const date = new Date(card.dueDate)
    // const day = date.getDate()
    // const month = date.getMonth() + 1
    // const year = date.getFullYear()

    // const showFormEdit = () => {
    //     setIsVisibleEdit(true)
    // }

    // const hideFormEdit = () => {
    //     setIsVisibleEdit(false)
    // }

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
            <div>
                <div>{card.name}</div>
                {
                    card.progress ? <div className={styles.bar} >
                        <div
                            style={{
                                width: `${card.progress}%`,
                                ['backgroundColor']: progressColor(card.progress)
                            }}
                            className={styles.progress}
                        />
                    </div> : null
                }
            </div>
            {/* {
                card.dueDate ? <div>{`${day}-${month}-${year}`}</div> : null
            } */}
            <div className={styles.flex}>
                <div className={styles.members}>
                    {card.members.map(element => {
                        return (
                            <span className={styles.avatar}>
                            <Avatar key={element._id} name={element.username} size={30} round={true} maxInitials={2} />
                            </span>
                            )
                    })}
                </div>
                {/* {isVisible ?
                    < div >
                        <Transparent hideForm={() => setIsVisible(!isVisible)} >
                            <EditCard hideForm={() => setIsVisible(!isVisible)} card={card} listId={listId} project={project} />
                        </Transparent >
                    </div > : null
                } */}
                <ButtonClean
                    className={styles.pen}
                    onClick={() => props.showEditCard()}
                    title={<img src={pen} alt="..." width="11.5" height="11.5" />}
                />
            </div>
        </div >
    )
}
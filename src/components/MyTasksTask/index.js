/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import Transparent from '../Transparent'
import EditCard from '../EditCard'
import AttachmentsLink from '../AttachmentsLink'
import ProgressInput from '../Inputs/ProgressInput'
import pen from '../../images/pen.svg'
import { getDaysLeft } from '../../utils/date'

// eslint-disable-next-line react/prop-types
const MyTasksTask = ({ teamId, project, list, card }) => {
    const [isEditCardActive, setIsEditCardActive] = useState(false)
    const daysLeft = getDaysLeft(card.dueDate)

    return (
        <div key={card._id} className={styles.card}>
            <div className={styles.task}>{card.name}</div>
            <div className={styles.progress}>
                <ProgressInput
                    card={card}
                    listId={list._id}
                    project={project}
                    teamId={teamId}
                    inputClassName={styles.input}
                    placeholderClassName={styles['progress-div']}
                />
            </div>
            <div className={styles.days}>
                {card.progress === 100
                    ? <div>Done</div>
                    : Date.parse(card.dueDate) === 0 || !card.dueDate
                        ? <div>No Deadline</div>
                        : daysLeft < 0
                            ? <div className={styles.deadline}>Deadline Passed</div>
                            : <div>{daysLeft}</div>
                }
            </div>
            <div className={styles['buttons-container']}>
                {card.attachments.length > 0 && <AttachmentsLink card={card} project={project} teamId={teamId} />}
                <ButtonClean
                    className={styles.button}
                    onClick={() => setIsEditCardActive(true)}
                    title={<img src={pen} alt='' width='14' />}
                />
            </div>
            { isEditCardActive &&
                <div className={styles.edit}>
                    <Transparent hideForm={() => setIsEditCardActive(!isEditCardActive)} >
                        <EditCard
                            hideForm={() => setIsEditCardActive(!isEditCardActive)}
                            card={card}
                            listId={list._id}
                            project={project}
                            teamId={teamId}
                        />
                    </Transparent>
                </div>
            }
        </div>
    )
}

export default MyTasksTask
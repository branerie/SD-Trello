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
                /* REVIEW: Ако няма грешки някъде, първото от трите условия отдолу би трябвало да е излишно. Date.parse(...)
					ще върне 0 само ако му подадеш датата 01.01.1970, което няма логика някога да става, освен ако другаде има
					грешка. Ама може да се защитим от тая грешка за всеки случай. Поне другите две условия могат да се съберат
					в едно и да стане Date.parse(card.dueDate) === 0 || !card.dueDate
					Иначе готино тройно тернари, но в интерес на истината не се чете трудно :D
					*/
                    : Date.parse(card.dueDate) === 0 || card.dueDate === null || card.dueDate === undefined
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
            {/* REVIEW: Сякаш по-добре когато компонента/тага не се събира на един ред (или става мн дълго просто) и се вика 
            с <променлива> && ... да се слага отварящия таг на долния ред.
            */}
            { isEditCardActive && <div className={styles.edit}>
                <Transparent hideForm={() => setIsEditCardActive(!isEditCardActive)} >
                    <EditCard
                        hideForm={() => setIsEditCardActive(!isEditCardActive)}
                        card={card}
                        listId={list._id}
                        project={project}
                        teamId={teamId}
                    />
                </Transparent>
            </div>}
        </div>
    )
}

export default MyTasksTask
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ButtonClean from '../button-clean'
import pen from '../../images/pen.svg'
import styles from "./index.module.css"
import Transparent from '../transparent'
import EditCard from '../edit-card'

export default function MyTasksProject({ project, currTeam }) {
    const [showEditCard, setShowEditCard] = useState(false)
    const [editInfo, setEditInfo] = useState({})

    return (
        <div className={styles.project}>
            <div className={styles['project-name']}>
                <Link to={`/project-board/${currTeam._id}/${project._id}`} className={styles.link}>
                    <span className={styles.bold}>Project:</span> {project.name}
                </Link>
            </div>
            <div className={`${styles.header} ${styles.card}`}>
                <div className={styles.task}>Task:</div>
                <div className={styles.list}>List:</div>
                <div className={styles.progress}>Progress:</div>
                <div className={styles.days}>Days Till End:</div>
            </div>
            {
                project.lists.map(list => {
                    return (
                        <div key={list._id}>
                            {list.cards.map(card => {
                                return (
                                    <div key={card._id} className={styles.card}>
                                        <div className={styles.task}>{card.name}</div>
                                        <div className={styles.list}>{list.name}</div>
                                        <div className={styles.progress}>{card.progress}%</div>
                                        <div className={styles.days}>{Math.ceil((Date.parse(card.dueDate) - Date.now()) / 1000 / 3600 / 24)}</div>
                                        <ButtonClean
                                            className={styles.pen}
                                            onClick={() => {
                                                setShowEditCard(true)
                                                setEditInfo({
                                                    card,
                                                    listId: list._id,
                                                    project
                                                })
                                            }}
                                            title={<img src={pen} alt="..." width="11.5" height="11.5" />}
                                        />
                                    </div>
                                )
                            })}
                        </div>)
                })
            }
            {
                showEditCard &&
                <Transparent hideForm={() => setShowEditCard(!showEditCard)} >
                    <EditCard
                        hideForm={() => setShowEditCard(!showEditCard)}
                        card={editInfo.card}
                        listId={editInfo.listId}
                        project={editInfo.project}
                        teamId={currTeam._id}
                    />
                </Transparent>
            }
        </div>
    )
}
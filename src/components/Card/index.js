import React, { useState } from 'react'
import styles from './index.module.css'
import pen from '../../images/pen.svg'
import ButtonClean from '../ButtonClean'
import MembersList from '../MembersList'
import ProgressBar from '../ProgressBar'
import { useParams } from 'react-router-dom'
import AttachmentsLink from '../AttachmentsLink'
import Transparent from '../Transparent'
import EditCard from '../EditCard'

export default function Card({ card, listId, project, setIsDragCardDisabled, setIsDragListDisabled }) {
    const params = useParams()
    const teamId = params.teamid
    const [isVisible, setIsVisible] = useState(false)

    const hideForm = () => {
        setIsVisible(!isVisible)
        setIsDragCardDisabled(false)
        setIsDragListDisabled(false)
    }

    return (
        <>
            <div className={styles.card}>
                <div>
                    {((card.progress && card.progress !== 0) || card.members.length > 0 || card.attachments.length > 0) ?
                        <div className={styles.container}>
                            {card.progress ? <div className={styles.progress}><ProgressBar progress={card.progress} /></div> : <div></div>}
                            <div className={styles.container}>
                                {card.attachments.length > 0 &&
                                    <AttachmentsLink
                                        card={card}
                                        project={project}
                                        teamId={teamId}
                                        setIsDragCardDisabled={setIsDragCardDisabled}
                                        setIsDragListDisabled={setIsDragListDisabled}
                                    />
                                }
                                <MembersList
                                    members={card.members}
                                    maxLength={2}
                                />
                            </div>
                        </div> : null
                    }
                    <div className={styles['card-name']}>
                        {card.name}
                    </div>
                </div>
                <ButtonClean
                    className={styles.button}
                    onClick={() => {
                        setIsDragCardDisabled(true)
                        setIsDragListDisabled(true)
                        setIsVisible(true)
                    }}
                    title={<img src={pen} alt='' width='11.5' height='11.5' />}
                />
            </div >
            {isVisible &&
                <Transparent hideForm={hideForm} >
                    <EditCard
                        hideForm={hideForm}
                        initialCard={card}
                        listId={listId}
                        project={project}
                        teamId={teamId}
                    />
                </Transparent >
            }
        </>
    )
}
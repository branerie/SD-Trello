import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import MembersList from '../MembersList'
import ProgressBar from '../ProgressBar'
import AttachmentsLink from '../AttachmentsLink'
import Transparent from '../Transparent'
import EditCard from '../EditCard'
import pen from '../../images/pen.svg'

const Card = ({ card, listId, project, setIsDragCardDisabled, setIsDragListDisabled }) => {
    const { teamid: teamId } = useParams()
    const [isVisible, setIsVisible] = useState(false)

    const hideForm = () => {
        setIsVisible(!isVisible)
        setIsDragCardDisabled(false)
        setIsDragListDisabled(false)
    }

    const onClick = () => {
        setIsDragCardDisabled(true)
        setIsDragListDisabled(true)
        setIsVisible(true)
    }

    return (
        <>
            <div className={styles.card}>
                <div>
                    {((card.progress && card.progress !== 0) || card.members.length > 0 || card.attachments.length > 0) &&
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
                        </div>
                    }
                    <div className={styles['card-name']}>
                        {card.name}
                    </div>
                </div>
                <ButtonClean
                    className={styles.button}
                    onClick={onClick}
                    title={<img src={pen} alt='' width='11.5' />}
                />
            </div >
            {isVisible &&
                <Transparent hideForm={hideForm} >
                    <EditCard
                        hideForm={hideForm}
                        card={card}
                        listId={listId}
                        project={project}
                        teamId={teamId}
                    />
                </Transparent >
            }
        </>
    )
}

export default Card
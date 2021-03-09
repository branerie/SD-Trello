import React, { useRef } from 'react'
import styles from './index.module.css'
import pen from '../../images/pen.svg'
import ButtonClean from '../ButtonClean'
import MembersList from '../MembersList'
import ProgressBar from '../ProgressBar'
import Transparent from '../Transparent'
import AttachmentList from '../AttachmentList'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import { useParams } from 'react-router-dom'
import AttachmentsLink from '../AttachmentsLink'

export default function Card({ card, project, showCurrentCard, setCurrCard }) {
    const listRef = useRef(null)
    const [isListVisible, setIsListVisible] = useDetectOutsideClick(listRef)
    const params = useParams()
    const teamId = params.teamid

    return (
        <div className={styles.card}>
            <div>
                {((card.progress && card.progress !== 0) || card.members.length > 0 || card.attachments.length > 0) ?
                    <div className={styles.container}>
                        {card.progress ? <div className={styles.progress}><ProgressBar progress={card.progress} /></div> : <div></div>}
                        <div className={styles.container}>
                            {card.attachments.length > 0 && 
                                <AttachmentsLink card={card} project={project} teamId={teamId} />
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
                    showCurrentCard()
                    setCurrCard(card)
                }}
                title={<img src={pen} alt='' width='11.5' height='11.5' />}
            />
            {isListVisible && <Transparent hideForm={() => setIsListVisible(false)} >
                <AttachmentList
                    listRef={listRef}
                    attachments={card.attachments}
                    card={card}
                    project={project}
                    teamId={teamId}
                />
            </Transparent >}
        </div >
    )
}
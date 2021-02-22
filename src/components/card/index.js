import React, { useRef } from 'react'
import styles from './index.module.css'
import pen from '../../images/pen.svg'
import ButtonClean from '../button-clean'
import MembersList from '../members-list'
import ProgressBar from '../progress-bar'
import Transparent from '../transparent'
import AttachmentList from '../attachmentList'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import { useParams } from 'react-router-dom'

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
                            {card.attachments.length > 0 && <ButtonClean
                                className={`${styles.attachments} ${styles.button}`}
                                onClick={() => setIsListVisible(true)}
                                title={<img src={attPic} alt="" width='14px' />}
                            />}
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
                title={<img src={pen} alt="" width="11.5" height="11.5" />}
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
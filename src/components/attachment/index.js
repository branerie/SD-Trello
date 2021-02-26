import React, { useRef } from 'react'
import styles from './index.module.css'
import pic1 from '../../images/edit-card/pic1.svg'
import AttachmentList from '../attachmentList'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import Transparent from '../transparent'

export default function Attachment({ att, attachments, card, project, teamId, setCurrCard }) {
    const listRef = useRef(null)
    const [isListVisible, setIsListVisible] = useDetectOutsideClick(listRef)

    return (
        <div>
            <div
                className={styles.attachment}
                onClick={() => setIsListVisible(true)}
                title={att.name}
            >
                <img src={pic1} alt="" className={styles['att-picture']} />
                <div className={styles.format}>{att.format}</div>
            </div>
            {isListVisible && <Transparent hideForm={() => setIsListVisible(false)} >
                <AttachmentList
                    listRef={listRef}
                    attachments={attachments}
                    card={card}
                    project={project}
                    teamId={teamId}
                    setCurrCard={setCurrCard}
                />
            </Transparent >}
        </div>
    )
}

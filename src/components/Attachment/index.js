import React from 'react'
import styles from './index.module.css'
import pic1 from '../../images/edit-card/task-name.svg'
import AttachmentList from '../AttachmentList'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import Transparent from '../Transparent'

export default function Attachment({ att, attachments, card, project, teamId }) {
    const [isListVisible, setIsListVisible, listRef] = useDetectOutsideClick()

    return (
        <div>
            <div
                className={styles.attachment}
                onClick={() => setIsListVisible(true)}
                title={att.name}
            >
                <img src={pic1} alt='' className={styles['att-picture']} />
                <div className={styles.format}>{att.format}</div>
            </div>
            {isListVisible && <Transparent hideForm={() => setIsListVisible(false)} >
                <AttachmentList
                    listRef={listRef}
                    attachments={attachments}
                    card={card}
                    project={project}
                    teamId={teamId}
                />
            </Transparent >}
        </div>
    )
}

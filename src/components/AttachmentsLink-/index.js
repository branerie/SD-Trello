import React, { useRef } from 'react'
import ButtonClean from '../ButtonClean'
import styles from './index.module.css'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

import attPic from '../../images/edit-card/pic6.svg'
import Transparent from '../Transparent'
import AttachmentList from '../AttachmentList'

const AttachmentsLink = ({ card, project, teamId }) => {
    const listRef = useRef(null)
    const [isVisible, setIsVisible] = useDetectOutsideClick(listRef)

    return (
        <>
        <ButtonClean
            className={`${styles.attachments} ${styles.button}`}
            onClick={() => setIsVisible(true)}
            title={<img src={attPic} alt="" width='14px' />}
        />
        { isVisible &&
            <Transparent hideForm={() => setIsVisible(false)} >
                <AttachmentList
                    listRef={listRef}
                    attachments={card.attachments}
                    card={card}
                    project={project}
                    teamId={teamId}
                />
            </Transparent >
        }
        </>
    )
}

export default AttachmentsLink
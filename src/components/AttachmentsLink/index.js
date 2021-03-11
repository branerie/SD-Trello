import React from 'react'
import ButtonClean from '../ButtonClean'
import styles from './index.module.css'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import attPic from '../../images/edit-card/pic6.svg'
import Transparent from '../Transparent'
import AttachmentList from '../AttachmentList'

const AttachmentsLink = ({
    card,
    project,
    teamId,
    setIsDragCardDisabled,
    setIsDragListDisabled
}) => {
    const [isVisible, setIsVisible, listRef] = useDetectOutsideClick()

    const onClick = () => {
        setIsVisible(true)

        if (setIsDragCardDisabled) setIsDragCardDisabled(true)

        if (setIsDragListDisabled) setIsDragListDisabled(true)

    }

    const hideForm = () => {
        setIsVisible(false)

        if (setIsDragCardDisabled) setIsDragCardDisabled(false)

        if (setIsDragListDisabled) setIsDragListDisabled(false)
    }

    return (
        <>
        <ButtonClean
            className={`${styles.attachments} ${styles.button}`}
            onClick={onClick}
            title={<img src={attPic} alt='' width='14px' />}
        />
        { isVisible &&
            <Transparent hideForm={hideForm} >
                <AttachmentList
                    listRef={listRef}
                    attachments={card.attachments}
                    card={card}
                    project={project}
                    teamId={teamId}
                    setIsDragCardDisabled={setIsDragCardDisabled}
                    setIsDragListDisabled={setIsDragListDisabled}
                />
            </Transparent >
        }
        </>
    )
}

export default AttachmentsLink
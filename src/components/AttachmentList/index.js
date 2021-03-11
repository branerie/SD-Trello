import React, { useState, useEffect } from 'react'
import ButtonClean from '../ButtonClean'
import styles from './index.module.css'
import download from '../../images/edit-card/download.svg'
import remove from '../../images/edit-card/remove.svg'
import { useSocket } from '../../contexts/SocketProvider'
import ConfirmDialog from '../ConfirmationDialog'
import useCardsServices from '../../services/useCardsServices'

export default function AttachmentList({ attachments, listRef, card, project, teamId, setIsDragCardDisabled, setIsDragListDisabled }) {
    const socket = useSocket()
    const [attachmentsArr, setAttachmentsArr] = useState([])
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currElement, setCurrElement] = useState('')
    const { removeAttachment } = useCardsServices()

    useEffect(() => {
        setAttachmentsArr(attachments)
    }, [attachments])

    const getFullDocumentUrl = (att) => {
        return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/raw/upload/fl_attachment/${att.path}`
    }

    async function handleDeteleAttachment(att) {
        const updatedCard = await removeAttachment(card._id, att._id)

        setAttachmentsArr(updatedCard.attachments)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }

    const onConfirm = () => {
        handleDeteleAttachment(currElement)
        
        if (setIsDragCardDisabled) setIsDragCardDisabled(false)
        if (setIsDragListDisabled) setIsDragListDisabled(false)
    }
    
    const onDecline = () => {
        if (setIsDragCardDisabled) setIsDragCardDisabled(false)
        if (setIsDragListDisabled) setIsDragListDisabled(false)
    }

    return (
        <div ref={listRef}>
            <div className={styles.container}>
                <div className={styles.title}>Task Attachments</div>
                {attachmentsArr.map((att, index) => (
                    <div key={index} className={styles.attachment}>
                        <div className={styles.name}>{att.name}.{att.format}</div>
                        <div>
                            <ButtonClean title={<img className={styles.button} src={download} alt='Download' />} onClick={() => window.open(getFullDocumentUrl(att), '_blank')} />
                            <ButtonClean title={<img className={styles.button} src={remove} alt='Remove' />}
                                onClick={() => {
                                    setConfirmOpen(true)
                                    setCurrElement(att)
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {confirmOpen &&
                <ConfirmDialog
                    title='remove this attachment'
                    hideConfirm={() => setConfirmOpen(false)}
                    onConfirm={onConfirm}
                    onDecline={onDecline}
                />
            }
        </div>
    )
}

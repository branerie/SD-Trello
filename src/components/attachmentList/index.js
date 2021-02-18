import React, { useState, useEffect } from 'react'
import ButtonClean from '../button-clean'
import styles from './index.module.css'
import download from '../../images/edit-card/download.svg'
import remove from '../../images/edit-card/remove.svg'
import { useHistory } from 'react-router-dom'
import getCookie from '../../utils/cookie'
import { useSocket } from '../../contexts/SocketProvider'

export default function AttachmentList({ attachments, listRef, card, project, teamId }) {
    const socket = useSocket()
    const history = useHistory()
    const token = getCookie("x-auth-token")
    const [attachmentsArr, setAttachmentsArr] = useState([])

    useEffect(() => {
        setAttachmentsArr(attachments)
    }, [attachments])

    const getFullDocumentUrl = (att) => {
        return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/raw/upload/fl_attachment/${att.path}`
    }

    async function deteleAttachment(att) {
        const response = await fetch(`/api/projects/lists/cards/attachments/${card._id}/${att._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            const updatedCard = await response.json()
            setAttachmentsArr(updatedCard.attachments)
            socket.emit('project-update', project)
            socket.emit('task-team-update', teamId)
        }
    }

    return (
        <div ref={listRef} className={styles.container}>
            <div className={styles.title}>Task Attachments</div>
            {attachmentsArr.map(att => (
                <div className={styles.attachment}>
                    <div className={styles.name}>{att.name}.{att.format}</div>
                    <div>
                        <ButtonClean title={<img className={styles.button} src={download} alt="Download" />} onClick={() => window.open(getFullDocumentUrl(att), "_blank")} />
                        <ButtonClean title={<img className={styles.button} src={remove} alt="Remove" />} onClick={() => deteleAttachment(att)} />
                    </div>
                </div>
            ))}
        </div>
    )
}

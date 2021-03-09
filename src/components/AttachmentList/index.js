import React, { useState, useEffect } from 'react'
import ButtonClean from '../ButtonClean'
import styles from './index.module.css'
import download from '../../images/edit-card/download.svg'
import remove from '../../images/edit-card/remove.svg'
import { useHistory } from 'react-router-dom'
import getCookie from '../../utils/cookie'
import { useSocket } from '../../contexts/SocketProvider'
import ConfirmDialog from '../ConfirmationDialog'

export default function AttachmentList({ attachments, listRef, card, project, teamId, setCurrCard }) {
    const socket = useSocket()
    const history = useHistory()
    const token = getCookie('x-auth-token')
    const [attachmentsArr, setAttachmentsArr] = useState([])
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currElement, setCurrElement] = useState('')

    useEffect(() => {
        setAttachmentsArr(attachments)
    }, [attachments])

    const getFullDocumentUrl = (att) => {
        return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/raw/upload/fl_attachment/${att.path}`
    }

    async function deteleAttachment(att) {
        const response = await fetch(`/api/projects/lists/cards/attachments/${card._id}/${att._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        if (!response.ok) {
            history.push('/error')
            return
        } else {
            const updatedCard = await response.json()
            if (setCurrCard) setCurrCard(updatedCard)
            setAttachmentsArr(updatedCard.attachments)
            socket.emit('project-update', project)
            socket.emit('task-team-update', teamId)
        }
    }

    

    return (
        <>
        {confirmOpen &&
            <ConfirmDialog
                title='remove this attachment'
                hideConfirm={() => setConfirmOpen(false)}
                onConfirm={() => deteleAttachment(currElement)}
            />
        }
        <div ref={listRef} className={styles.container}>
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
                        //  onClick={() => deteleAttachment(att)} 
                         />
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}

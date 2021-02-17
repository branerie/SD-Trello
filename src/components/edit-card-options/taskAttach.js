import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import pic6 from '../../images/edit-card/pic6.svg'
import getCookie from '../../utils/cookie'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import Attachment from '../attachment'

export default function TaskAttach({ card, project, teamId }) {
    const token = getCookie("x-auth-token")
    const history = useHistory()
    const socket = useSocket()
    const [attachments, setAttachments] = useState(null)

    useEffect(() => {
        setAttachments(card.attachments)
    }, [card.attachments])

    function addAttachment() {
        const widget = window.cloudinary.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUD_NAME,
            uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
            resourceType: 'raw'

        }, async (error, result) => {
            if (result.event === "upload-added") {
                console.log(widget);
                console.log(result);
            }
            if (result.event === 'success') {
                const path = result.info.path
                const name = result.info.original_filename
                let format = result.info.format
                console.log(result.info);
                if (!format) {
                    format = path.split('.')[1]
                }
                const publicId = result.info.public_id
                const attachment = { path, name, format, publicId }


                const response = await fetch(`/api/projects/lists/cards/attachments/${card._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        attachment
                    })
                })
                if (!response.ok) {
                    history.push("/error")
                } else {
                    const updatedCard = await response.json()
                    setAttachments(updatedCard.attachments)
                    socket.emit('project-update', project)
                    socket.emit('task-team-update', teamId)
                }
            }

            if (error) {
                //TODO: Handle errors

                return
            }
        })

        widget.open()
    }

    return (
        <div>
            <div className={styles['small-buttons']} onClick={addAttachment}>
                <img className={styles.pics} src={pic6} alt="pic6" />
                Attach File
            </div>
            { attachments && <div className={styles['att-container']}>
                {attachments.length <= 4 ? attachments.map(att => (
                    <Attachment key={att._id} att={att} attachments={attachments} card={card} project={project} />
                )) :
                <>
                {attachments.slice(0, 3).map(att => (
                    <Attachment key={att._id} att={att} attachments={attachments} card={card} teamId={teamId} />
                ))}
                <div className={`${styles.remaining} ${styles.attachment}`}>
                    +{attachments.length - 3}
                </div>
                </>
                }
            </div>}
        </div>
    )
}

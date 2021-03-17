import React, { useState, useEffect } from 'react'
import { useSocket } from '../../../contexts/SocketProvider'
import commonStyles from '../index.module.css'
import styles from './index.module.css'
import Attachment from '../../Attachment'
import attachmentPic from '../../../images/edit-card/attachments.svg'
import useCardsServices from '../../../services/useCardsServices'

const TaskAttach = ({ card, project, teamId }) => {
    const socket = useSocket()
    const [attachments, setAttachments] = useState(null)
    const { addAttachment } = useCardsServices()

    useEffect(() => {
        setAttachments(card.attachments)
    }, [card.attachments])

    const handleAddAttachment = () => {
        const widget = window.cloudinary.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUD_NAME,
            uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
            resourceType: 'raw'

        }, async (error, result) => {
            if (result.event === 'success') {
                const path = result.info.path
                const name = result.info.original_filename
                let format = result.info.format

                // Gets the format from path if cloudinary doesn`t recognize it (path example: v1615887046/vov2gj7vmvqi6h8dzfxf.png)
                if (!format) {
                    format = path.split('.')[1]
                }

                const publicId = result.info.public_id
                const attachment = { path, name, format, publicId }

                const updatedCard = await addAttachment(card._id, attachment)
                setAttachments(updatedCard.attachments)
                socket.emit('project-update', project)
                socket.emit('task-team-update', teamId)
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
            <div className={commonStyles['small-buttons']} onClick={handleAddAttachment}>
                <img className={commonStyles.pics} src={attachmentPic} alt='attachmentPic' />
                Attach File
            </div>
            { attachments && <div className={styles['att-container']}>
                {attachments.length <= 4 ? attachments.map(att => (
                    <Attachment
                        key={att._id}
                        att={att}
                        attachments={attachments}
                        card={card}
                        project={project}
                        teamId={teamId}
                    />
                )) :
                    <>
                        {attachments.slice(0, 3).map(att => (
                            <Attachment
                                key={att._id}
                                att={att}
                                attachments={attachments}
                                card={card}
                                project={project}
                                teamId={teamId}
                            />
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

export default TaskAttach
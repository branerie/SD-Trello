import React from 'react'
import ButtonClean from '../button-clean'
import styles from './index.module.css'
import download from '../../images/edit-card/download.svg'
import remove from '../../images/edit-card/remove.svg'
import { useHistory } from 'react-router-dom'
import getCookie from '../../utils/cookie'

export default function AttachmentList({ attachments, ref, card }) {
    const history = useHistory()
    const token = getCookie("x-auth-token")

    const getFullDocumentUrl = (att) => {
        return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/fl_attachment:${att.name}/${att.path}`
    }



    async function deteleAttachment(att) {
        console.log('1');
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
            console.log(2);
            const updatedCard = await response.json()
        }
    }

    return (
        <div ref={ref} className={styles.container}>
            <div className={styles.title}>Task Attachments</div>
            {attachments.map(att => (
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

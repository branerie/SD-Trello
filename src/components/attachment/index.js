import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.css'
import pic1 from '../../images/edit-card/pic1.svg'
import AttachmentList from '../attachmentList'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import Transparent from '../transparent'


export default function Attachment({ att, attachments, card, project, teamId }) {
    const ref = useRef(null)
    const nameRef = useRef(null)
    const listRef = useRef(null)
    const [isNameVisible, setIsNameVisible] = useState(false)
    const [nameWidth, setNameWidth] = useState(null)
    const [isListVisible, setIsListVisible] = useDetectOutsideClick(listRef)

    // hover is equal to 'hidden' only if mouse is still over the attachment
    const onMouseEnter = () => {
        setTimeout(() => {
            if (ref.current) {
                const hover = window.getComputedStyle(ref.current).getPropertyValue('border-top-style')
                if (hover === "hidden") setIsNameVisible(true)
            }
        }, 700);
    }

    function onMouseLeave() {
        setIsNameVisible(false)
    }

    useEffect(() => {
        if (nameRef.current) {
            setNameWidth(window.getComputedStyle(nameRef.current).getPropertyValue('width'))
        }
    }, [onMouseEnter])

    return (
        <div>
            <div className={styles.attachment} ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={() => setIsListVisible(true)}>
                <img src={pic1} alt="" className={styles['att-picture']} />
                <div className={styles.format}>{att.format}</div>
                {isNameVisible &&
                    <div
                        ref={nameRef}
                        className={styles.name}
                        style={{ '--width': `${nameWidth}` }}
                    >{att.name}</div>
                }
            </div>
            {isListVisible && <Transparent hideForm={() => setIsListVisible(false)} >
                <AttachmentList listRef={listRef} attachments={attachments} card={card} project={project} teamId={teamId} />
            </Transparent >

            }
        </div>
    )
}

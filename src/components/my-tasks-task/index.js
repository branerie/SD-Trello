import React, { useState, useRef } from 'react'
import ButtonClean from '../button-clean'
import pen from '../../images/pen.svg'
import styles from "./index.module.css"
import Transparent from '../transparent'
import EditCard from '../edit-card'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import getCookie from '../../utils/cookie'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'

export default function MyTasksTask({ currTeam, project, list, card }) {
    const inputRef = useRef(null)
    const [isInputActive, setIsInputActive] = useDetectOutsideClick(inputRef)
    const [showEditCard, setShowEditCard] = useState(false)
    const [progress, setProgress] = useState(card.progress)
    const [isInputOk, setIsInputOk] = useState(true)
    const history = useHistory()
    const socket = useSocket()

    async function onBlur() {
        if (!isInputOk || Number(progress) === card.progress) return

        const today = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
        let arr = [...card.history]

        arr.push({
            'event': `Progress ${progress}%`,
            'date': today
        })

        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${list._id}/${card._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                progress: progress,
                history: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            socket.emit('project-update', project)
            socket.emit('task-team-update', currTeam._id)
        }


    }

    function onKeyUp() {
        if (Number.isNaN(Number(progress)) || progress < 0 || progress > 100) {
            setIsInputOk(false)
        } else {
            setIsInputOk(true)
        }
    }

    return (
        <div key={card._id} className={styles.card}>
            <div className={styles.task}>{card.name}</div>
            <div className={styles.list}>{list.name}</div>
            <div className={styles.progress}>
                {
                    isInputActive ? <div>
                        <input
                            ref={inputRef}
                            type={'text'}
                            className={`${styles.input} ${!isInputOk && styles['bad-input']}`}
                            autoComplete="off"
                            value={progress}
                            onBlur={onBlur}
                            onKeyUp={onKeyUp}
                            onChange={e => setProgress(e.target.value)}
                        />
                    </div> : <ButtonClean onClick={() => setIsInputActive(true)} title={`${card.progress}%`} />
                }
            </div>
            <div className={styles.days}>{Math.ceil((Date.parse(card.dueDate) - Date.now()) / 1000 / 3600 / 24)}</div>
            <ButtonClean
                className={styles.pen}
                onClick={() => setShowEditCard(true)}
                title={<img src={pen} alt="..." width="11.5" height="11.5" />}
            />
            {
                showEditCard &&
                <Transparent hideForm={() => setShowEditCard(!showEditCard)} >
                    <EditCard
                        hideForm={() => setShowEditCard(!showEditCard)}
                        card={card}
                        listId={list._id}
                        project={project}
                        teamId={currTeam._id}
                    />
                </Transparent>
            }
        </div>
    )
}

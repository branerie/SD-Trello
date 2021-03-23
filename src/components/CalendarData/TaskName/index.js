import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../../../contexts/SocketProvider'
import commonStyles from '../index.module.css'
import styles from './index.module.css'
import AttachmentsLink from '../../AttachmentsLink'
import ResponsiveTextArea from '../../Inputs/ResponsiveTextarea'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import useCardsServices from '../../../services/useCardsServices'

const TaskName = ({ card, listId, project }) => {
    const [isActive, setIsActive, inputRef] = useDetectOutsideClick()
    const [cardName, setCardName] = useState(card.name)
    const socket = useSocket()
    const { teamid: teamId } = useParams()
    const { editTask } = useCardsServices()

    const editCardName = useCallback(async () => {
        if (cardName === '') {
            return
        }

        const editedFields = { name: cardName }
        await editTask(listId, card._id, editedFields)

        setIsActive(!isActive)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)

    }, [editTask, cardName, isActive, setIsActive, card._id, listId, project, socket, teamId])

    return (
        <div>
            { isActive ?
                < div ref={inputRef} className={styles['name-container']}>
                    <ResponsiveTextArea
                        value={cardName}
                        setValue={setCardName}
                        className={commonStyles['input-name']}
                        onSubmit={editCardName}
                        toggleActive={() => setIsActive(!isActive)}
                        onBlur={editCardName}
                        autoFocus={true}
                    />
                </div>
                :
                <div>
                    <span className={styles['attachments-container']}>
                        {(card.attachments && card.attachments.length > 0 && !isActive) &&
                            <AttachmentsLink
                                card={card}
                                project={project}
                                teamId={teamId}
                            />
                        }
                    </span>
                    <div className={styles.text} onClick={() => setIsActive(!isActive)}>
                        {cardName}
                    </div>
                </div>
            }
        </div>
    )
}

export default TaskName
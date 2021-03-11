import React, { useCallback, useState } from 'react'
import commonStyles from '../index.module.css'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import { useParams } from 'react-router-dom'
import { useSocket } from '../../../contexts/SocketProvider'
import AttachmentsLink from '../../AttachmentsLink'
import ResponsiveTextArea from '../../ResponsiveTextarea'
import useCardsServices from '../../../services/useCardsServices'

export default function TaskName({ card, listId, project }) {
	const [isActive, setIsActive, inputRef] = useDetectOutsideClick()
	const [cardName, setCardName] = useState(card.name)
	const socket = useSocket()
	const params = useParams()
	const teamId = params.teamid
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
				< div ref={inputRef} className={commonStyles.nameContainer}>
					<ResponsiveTextArea
						value={cardName}
						setValue={setCardName}
						className={commonStyles['input-name']}
						onSubmit={editCardName}
						toggleActive={() => setIsActive(!isActive)}
					/>
				</div>
				:
				<div> 
					<span className={commonStyles['attachments-container']}>
						{(card.attachments && card.attachments.length > 0 && !isActive) &&
							<AttachmentsLink
								card={card}
								project={project}
								teamId={teamId}
							/>
						}
					</span>
					<div className={commonStyles.tableText} onClick={() => setIsActive(!isActive)}>
						{cardName}
					</div>
				</div>
			}
		</div>
	)
}


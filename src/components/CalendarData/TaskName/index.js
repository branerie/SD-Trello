import React, { useCallback, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import commonStyles from '../index.module.css'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'
import getCookie from '../../../utils/cookie'
import { useSocket } from '../../../contexts/SocketProvider'
import AttachmentsLink from '../../AttachmentsLink'
import ResponsiveTextArea from '../../ResponsiveTextarea'

export default function TaskName({ card, listId, project }) {
	const inputRef = useRef(null)
	const [isActive, setIsActive] = useDetectOutsideClick(inputRef)
	const [cardName, setCardName] = useState(card.name)
	const history = useHistory()
	const socket = useSocket()
	const params = useParams()
	const teamId = params.teamid

	const editCardName = useCallback(async () => {
		const cardId = card._id

		if (cardName === '') {
			return
		}

		const token = getCookie('x-auth-token')
		const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({
				name: cardName
			})
		})
		if (!response.ok) {
			history.push('/error')
			return
		} else {
			setIsActive(!isActive)
			socket.emit('project-update', project)
			socket.emit('task-team-update', teamId)
		}

	}, [history, cardName, isActive, setIsActive, card._id, listId, project, socket, teamId])

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


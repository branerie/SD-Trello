import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory, useParams } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';

import AttachmentsLink from '../attachmentsLink';
import ResponsiveTextArea from '../responsive-textarea';

export default function TaskName({ card, listId, project }) {

	const dropdownRef = useRef(null)
	const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
	const [cardName, setCardName] = useState(card.name)
	const history = useHistory()
	const socket = useSocket()
	const params = useParams()
	const teamId = params.teamid

	const editCardName = useCallback(async (event) => {
		event.preventDefault()

		const cardId = card._id

		if (cardName === "") {
			console.log('return');
			return
		}
		const token = getCookie("x-auth-token")
		const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": token
			},
			body: JSON.stringify({
				name: cardName
			})
		})
		if (!response.ok) {
			history.push("/error")
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
				< div ref={dropdownRef} className={styles.nameContainer} onBlur={editCardName} >
					{/* <input className={styles.inputElementName} type={'text'} value={cardName} onChange={e => setCardName(e.target.value)} /> */}
					{/* <textarea
						className={styles.inputElementName}
						value={cardName}
						onChange={e => setCardName(e.target.value)}
						rows={2}
					/> */}
					<ResponsiveTextArea
						value={cardName}
						setValue={setCardName}
						className={styles.inputElementName}
						onSubmit={editCardName}
						toggleActive={() => setIsActive(!isActive)}
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
					<div className={styles.tableText} onClick={() => setIsActive(!isActive)}>
						{cardName}
					</div>
				</div>
			}
		</div>
	)


}


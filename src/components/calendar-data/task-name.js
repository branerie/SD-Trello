import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory, useParams } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';


export default function TaskName(props) {

  const card = props.card
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
  const [cardName, setCardName] = useState(card.name)
  const history = useHistory()
  const socket = useSocket()
  const params = useParams()
  const teamId = params.teamid

  const editCardName = useCallback(async (event) => {
    event.preventDefault()

    const cardId = card._id
    const listId = props.listId


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
      socket.emit('project-update', props.project)
      socket.emit('task-team-update', teamId)
    }

  }, [history, cardName, isActive, setIsActive, card._id, props.listId, props.project, socket, teamId])


  return (
    <div>
      {
        isActive ?
          < div ref={dropdownRef} className={styles.nameContainer} onBlur={editCardName} >
            {/* <input className={styles.inputTaskName} type={'text'} value={cardName} onChange={e => setCardName(e.target.value)} /> */}
            <textarea 
              className={styles.inputTaskName} 
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              rows={2}
            />
          </div> :
          <div className={styles.tableText} onClick={() => setIsActive(!isActive)} >
            <span>{cardName}</span>
          </div >
      }
    </div>
  )


}


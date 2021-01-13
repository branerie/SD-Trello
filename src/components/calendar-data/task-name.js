import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';


export default function TaskName(props) {

  const card = props.card
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
  const [cardName, setCardName] = useState(card.name)
  const history = useHistory()
  const socket = useSocket()


  const updateProjectSocket = useCallback(() => {
    socket.emit('project-update', props.project)
  }, [socket, props.project])


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
      updateProjectSocket()
    }

  }, [history, cardName, updateProjectSocket, isActive, setIsActive,card._id,props.listId])


  return (
    <span>
      {
        isActive ?
          < div ref={dropdownRef} className={styles.nameContainer} onBlur={editCardName} >
            <input className={styles.inputTaskName} type={'text'} value={cardName} onChange={e => setCardName(e.target.value)} />
          </div> :
          <div className={styles.tableText} onClick={() => setIsActive(!isActive)} >
            <span>{cardName}</span>
          </div >
      }
    </span>
  )


}


import React, { useCallback, useRef, useState } from 'react'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketProvider';
import pen from '../../images/pen.svg'
import ButtonClean from '../button-clean';



export default function TaskName(props) {


  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
  const [cardName, setCardName] = useState('')
  const history = useHistory()
  const socket = useSocket()


  const updateProjectSocket = useCallback(() => {
    socket.emit('project-update', props.project)
  }, [socket, props.project])



  const editCardName = useCallback(async (event) => {
    event.preventDefault()

    console.log(cardName);

    let data = props.value.split('/')
    let cardId = data[1]
    let listId = data[2]


    if (cardName === "") {
      console.log('return');
      return
    }
    const token = getCookie("x-auth-token")
    const response = await fetch(`http://localhost:4000/api/projects/lists/cards/${listId}/${cardId}`, {
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
      setCardName('')
      setIsActive(!isActive)
      updateProjectSocket()
    }

  }, [history, cardName, updateProjectSocket, isActive, setIsActive, props.value])





  let value = props.value

  if (value) {
    let token = value.split('/')
    if (token.length === 1) {
      return (
        <div className={styles.listName}>{value}</div>
      )
    }
    let cardname = token[0]
    let cardId = token[1]
    let listId = token[2]



    return (
      <span>
        {
          isActive ?
            < form ref={dropdownRef} className={styles.container} onSubmit={editCardName} >
              <input className={styles.inputTaskName} type={'text'} placeholder={cardname} onChange={e => setCardName(e.target.value)} />
              <button type='submit' className={styles.taskProgressButton} cardId={cardId} listId={listId} cardName>Edit</button>
            </form> :
            <div className={styles.buttoDiv} >
              <span>{cardname}</span>

              <button type='submit' className={styles.clean} onClick={() => setIsActive(!isActive)} >
                <img src={pen} alt="..." width="11.5" height="11.5" />
              </button>


            </div >
        }
      </span>
    )
  }
  else {
    return value
  }

}


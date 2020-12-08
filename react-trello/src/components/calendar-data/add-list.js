import React, { useCallback, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import ButtonClean from '../button-clean'



export default function AddList(props) {

    const history = useHistory()     
    const [listName, setListName] = useState('')
    const listRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(listRef)
    const socket = useSocket()



    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


    const addList = useCallback(async (event) => {
        event.preventDefault()
        const projectId = props.project._id

        if (listName === "") {
            console.log('return');
            return
        }
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/${projectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ name: listName })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            setIsActive(!isActive)
            setListName('')
            updateProjectSocket()
        }

    }, [history, listName, updateProjectSocket, setIsActive, isActive,props.project._id])



    return (


        <div className={styles.list} >
            {
                isActive ?
                    <form ref={listRef} className={styles.container} >
                        <input className={styles.inputList} type={'text'} value={listName} onChange={e => setListName(e.target.value)} />
                        <ButtonClean type='submit' className={styles.addListButton} onClick={addList} title='+ Add' />
                    </form> : <ButtonClean className={styles.addListButton} onClick={() => setIsActive(!isActive)} title='+ Add List' />
            }

        </div>

    )
}

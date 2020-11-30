import React, { useCallback, useContext, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import ButtonClean from '../button-clean'
import Transparent from '../transparent'
import CreateCard from '../create-card'



export default function AddTask(props) {

    const params = useParams()
    const history = useHistory()
    const [project, setProject] = useState(null)
    const [members, setMembers] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [IsVisibleEdit, setIsVisibleEdit] = useState(false)
    const [cardName, setCardName] = useState('')
    const listRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(listRef, false)
    const socket = useSocket()



    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


    // const addTask = useCallback(async (event) => {
    //     event.preventDefault()
    //     const projectId = props.project._id

    //     if (cardName === "") {
    //         console.log('return');
    //         return
    //     }
    //     const token = getCookie("x-auth-token")
    //     const response = await fetch(`http://localhost:4000/api/projects/lists/${projectId}`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": token
    //         },
    //         body: JSON.stringify({ name: listName })
    //     })
    //     if (!response.ok) {
    //         history.push("/error")
    //         return
    //     } else {
    //         setIsActive(!isActive)
    //         setListName('')
    //         updateProjectSocket()
    //     }

    // }, [history, listName, updateProjectSocket])

    


    return (


        <div className={styles.flexend}>
            <ButtonClean
                className={styles.addnote}
                onClick={() => setIsVisible(!isVisible)}
                title='+ Add Task'
            />
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={() => setIsVisible(!isVisible)}>
                            <CreateCard hideForm={() => setIsVisible(!isVisible)} listId={ props.listId} project={props.project} />
                        </Transparent>
                    </div> : null
            }
        </div>
    )
}
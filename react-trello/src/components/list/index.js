import React, { useCallback, useRef, useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import Button from '../button'
import Card from '../card'
import CreateCard from '../create-card'
import EditList from '../edit-list'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function List(props) {
    const [isVisible, setIsVisible] = useState(false)
    const [IsVisibleEdit, setIsVisibleEdit] = useState(false)
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
    const history = useHistory()
    const socket = useSocket()

    const showForm = () => setIsVisible(true)

    const hideForm = () => setIsVisible(false)

    const showFormEdit = () => setIsVisibleEdit(true)

    const hideFormEdit = () => setIsVisibleEdit(false)

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])

    async function deleteList() {
        const token = getCookie("x-auth-token")
        const response = await fetch(`http://localhost:4000/api/projects/lists/${props.project._id}/${props.list._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
        }
    }

    const onClick = () => setIsActive(!isActive)

    return (
        <div className={styles.list} key={props.list._id}>
            <div className={styles.row}>
                <div>
                    {props.list.name}
                </div>
                <button className={styles.button} onClick={onClick}>
                    ...
                </button>
            </div>
            <div className={styles.relative}>
                <div
                    ref={dropdownRef}
                    className={`${styles.menu} ${isActive ? styles.active : ''}`}
                >
                    <div>
                        <button onClick={showFormEdit} >Edit</button>
                    </div>
                    <div>
                        <button onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteList() }} >Delete</button>
                    </div>
                </div>
            </div>
            <Droppable droppableId={props.list._id} type='droppableSubItem'>
                {(provided) => (
                    <div ref={provided.innerRef}>
                        {
                            props.list.cards.map((element, index) => {
                                return (
                                    <Draggable className={styles.droppable} key={element._id} draggableId={element._id} index={index}>
                                        {(provided) => (
                                            <div>
                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                    <Card key={index} card={element} listId={props.list._id} project={props.project} />
                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })
                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <button className={styles.addnote} onClick={showForm} >+ Add Note</button>
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={hideForm}>
                            <CreateCard hideForm={hideForm} listId={props.list._id} project={props.project} />
                        </Transparent>
                    </div> : null
            }
            {
                IsVisibleEdit ?
                    < div >
                        <Transparent hideForm={hideFormEdit} >
                            <EditList hideForm={hideFormEdit} list={props.list} project={props.project} />
                        </Transparent >
                    </div > : null
            }
        </div>
    )
}

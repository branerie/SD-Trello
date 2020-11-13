import React, { useCallback, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import Button from '../button'
import Card from '../card'
import CreateCard from '../create-card'
import EditList from '../edit-list'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function List(props) {
    const [isVisible, setIsVisible] = useState(false)
    const [IsVisibleEdit, setIsVisibleEdit] = useState(false)
    const history = useHistory()
    const socket = useSocket()

    const showForm = () => {
        setIsVisible(true)
    }

    const hideForm = () => {
        setIsVisible(false)
    }

    const showFormEdit = () => {
        setIsVisibleEdit(true)
    }

    const hideFormEdit = () => {
        setIsVisibleEdit(false)
    }

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

    return (
        <div className={styles.list} key={props.list._id}>
            <div>
                {props.list.name}
            </div>
            <DragDropContext >
                <Droppable droppableId='lists'>
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                props.list.cards.map((element, index) => {
                                    return (
                                        <Draggable key={element._id} draggableId={element._id} index={index}>
                                            {(provided) => (
                                                <li {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} >
                                                    <Card key={index} card={element} listId={props.list._id} project={props.project} />
                                                </li>
                                            )}
                                        </Draggable>
                                    )
                                })
                            }
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <Button title='Add card' onClick={showForm} />
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={hideForm}>
                            <CreateCard hideForm={hideForm} listId={props.list._id} project={props.project} />
                        </Transparent>
                    </div> : null
            }
            <Button title='Edit List' onClick={showFormEdit} />
            {
                IsVisibleEdit ?
                    < div >
                        <Transparent hideForm={hideFormEdit} >
                            <EditList hideForm={hideFormEdit} list={props.list} project={props.project} />
                        </Transparent >
                    </div > : null
            }
            <Button title='Delete List' onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteList() }} />
        </div>
    )
}

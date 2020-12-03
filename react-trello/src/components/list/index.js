import React, { useCallback, useRef, useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import getCookie from '../../utils/cookie'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import Card from '../card'
import CreateCard from '../create-card'
import EditList from '../edit-list'
import Transparent from '../transparent'
import styles from './index.module.css'
import dots from '../../images/dots.svg'
import ButtonClean from '../button-clean'
import ListColor from '../list-color'

export default function List(props) {
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleEdit, setIsVisibleEdit] = useState(false)
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const history = useHistory()
    const socket = useSocket()

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
        <div key={props.list._id} className={styles.list}>
            <div className={styles.row}>
                <div>
                    <div className={styles.name}>{props.list.name}</div>
                    <ListColor color={props.list.color || '#A6A48E'} type={'list'} />
                </div>
                <ButtonClean 
                    className={styles.button}
                    onClick={onClick}
                    title={<img src={dots} alt="..." width="20" height="6" />}
                />
            </div>
            <div className={styles.relative}>
                <div
                    ref={dropdownRef}
                    className={`${styles.menu} ${isActive ? styles.active : ''}`}
                >
                    <div>
                        <ButtonClean 
                            onClick={() => setIsVisibleEdit(!isVisibleEdit)}
                            title='Edit'
                        />
                    </div>
                    <div>
                        <ButtonClean
                            onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteList() }}
                            title='Delete'
                        />
                    </div>
                </div>
            </div>
            <Droppable droppableId={props.list._id} type='droppableSubItem'>
                {(provided) => (
                    <div className={styles.droppable} ref={provided.innerRef}>
                        {
                            props.list.cards.map((element, index) => {
                                return (
                                    <Draggable key={element._id} draggableId={element._id} index={index}>
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
            <div className={styles.flexend}>
                <ButtonClean 
                    className={styles.addnote}
                    onClick={() => setIsVisible(!isVisible)}
                    title='+ Add Task'
                />
            </div>
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={() => setIsVisible(!isVisible)}>
                            <CreateCard hideForm={() => setIsVisible(!isVisible)} listId={props.list._id} project={props.project} />
                        </Transparent>
                    </div> : null
            }
            {
                isVisibleEdit ?
                    < div >
                        <Transparent hideForm={() => setIsVisibleEdit(!isVisibleEdit)} >
                            <EditList hideForm={() => setIsVisibleEdit(!isVisibleEdit)} list={props.list} project={props.project} />
                        </Transparent >
                    </div > : null
            }
        </div>
    )
}

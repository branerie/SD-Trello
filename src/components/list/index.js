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
    const [isVisibleEdit, setIsVisibleEdit] = useState(false)
    const dropdownRef = useRef(null);
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useDetectOutsideClick(cardRef)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [cardName, setCardName] = useState('')
    const [currCard, setCurrCard] = useState('')
    const [currList, setCurrList] = useState('')

    const history = useHistory()
    const socket = useSocket()

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])

    async function deleteList() {
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/${props.project._id}/${props.list._id}`, {
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

    const addCard = useCallback(async (event) => {
        event.preventDefault()
        if (cardName === '') {
            return
        }
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${props.list._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name: cardName,
                description: '',
                dueDate: '',
                progress: '',
                members: []

            })
        })
        if (!response.ok) {
            history.push("/error")
            return
        } else {
            setIsVisible(!isVisible)
            setCardName('')
            updateProjectSocket()                      
        }

    }, [history, cardName, props.list._id, props, updateProjectSocket])

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
                    title={<img className={styles.dots} src={dots} alt="..." width="20" height="6" />}
                />
            </div>
            <div className={styles.relative}>
                <div
                    ref={dropdownRef}
                    className={`${styles.menu} ${isActive ? styles.active : ''}`}
                >
                    <div onClick={() => setIsVisibleEdit(!isVisibleEdit)}>
                        {/* <ButtonClean
                            onClick={() => setIsVisibleEdit(!isVisibleEdit)}
                            title='Edit'
                        /> */}
                        Edit
                    </div>
                    <div onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteList() }}>
                        {/* <ButtonClean
                            onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteList() }}
                            title='Delete'
                        /> */}
                        Delete
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
                                                    <Card
                                                        showEditCard={() => {
                                                            props.showCurrentCard(element)
                                                        }}
                                                        key={index}
                                                        card={element}
                                                        listId={props.list._id}
                                                        project={props.project} />
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
            {/* <div className={styles.flexend}> */}
            {/* <ButtonClean
                    className={styles['add-task']}
                    onClick={() => setIsVisible(!isVisible)}
                    title='+ Add Task'
                /> */}
            {/* </div> */}
            <div className={styles.flexend} >
                {
                    isVisible ?
                        <form ref={cardRef} className={styles.container} >
                            <input className={styles.taskInput} type={'text'} value={cardName} onChange={e => setCardName(e.target.value)} />
                            <ButtonClean type='submit' className={styles.addlist} onClick={addCard} title='+ Add Task' project={props.project} />
                        </form> : <ButtonClean className={styles['add-task']} onClick={() => setIsVisible(!isVisible)} title='+ Add Task' />

                }
            </div>
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

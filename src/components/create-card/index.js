import React, { useCallback, useRef, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import { useSocket } from '../../contexts/SocketProvider'
import pic1 from '../../images/edit-card/pic1.svg'
import pic2 from '../../images/edit-card/pic2.svg'
import pic3 from '../../images/edit-card/pic3.svg'
import pic4 from '../../images/edit-card/pic4.svg'
import pic5 from '../../images/edit-card/pic5.svg'
import pic6 from '../../images/edit-card/pic6.svg'
import pic7 from '../../images/edit-card/pic7.svg'
import pic8 from '../../images/edit-card/pic8.svg'
import pic9 from '../../images/edit-card/pic9.svg'
import pic10 from '../../images/edit-card/pic10.svg'
import pic11 from '../../images/edit-card/pic11.svg'
import pic12 from '../../images/edit-card/pic12.svg'
import pic13 from '../../images/edit-card/pic13.svg'
import pic14 from '../../images/edit-card/pic14.svg'
import TaskMembers from '../task-members'
import TaskDueDate from "../task-dueDate"
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import TaskHistory from '../task-history'


export default function CreateCard(props) {

    const listId = props.listId

    const dropdownRef = useRef(null);
    const [card, setCard] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [progress, setProgress] = useState('')
    const [taskHistory, setTaskHistory] = useState('')
    const [progressChanged, setProgressChanged] = useState(false)
    const history = useHistory()
    const socket = useSocket()
    const params = useParams()
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef)
    const [isProgressActive, setIsProgressActive] = useDetectOutsideClick(dropdownRef)
    const [isDescriptionActive, setIsDescriptionActive] = useState(false)
    const dueDate = ''
    const today = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
    const cardId = card._id


    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])


    const deleteCard = useCallback(async (event) => {
        event.preventDefault()
        
        if (name === '') {
            return
        }
        

        if (!window.confirm('Are you sure you wish to delete this item?')) {
            return
        }
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
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
            props.hideForm()
        }

    }, [history, props, cardId, listId, updateProjectSocket])


    const handleSubmit = async (event) => {
        event.preventDefault()

        if (Number(progress) > 100) {
            setProgress(100)
            return
        } else if (Number(progress) < 0) {
            setProgress(0)
            return
        }

        let arr = [...taskHistory]
        if (progressChanged) {
            arr.push({
                'event': `Progress ${progress}%`,
                'date': today
            })
            setTaskHistory(arr)
        }

        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${listId}/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                dueDate,
                progress,
                history: arr
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const updatedCard = await response.json()
            setCard(updatedCard)
            updateProjectSocket()
            setIsActive(false)
            setIsProgressActive(false)
            setIsDescriptionActive(false)
            setProgressChanged(false)

        }


    }

    const createTask = async (event) => {
        event.preventDefault()
       
        if (name === '') {
            return
        }
      

        if (Number(progress) > 100) {
            setProgress(100)
            return
        } else if (Number(progress) < 0) {
            setProgress(0)
            return
        }

        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/cards/${listId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                name,
                description,
                dueDate,
                progress
            })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            const updatedCard = await response.json()
            setCard(updatedCard)
            setTaskHistory(updatedCard.history)
            updateProjectSocket()
            setIsActive(false)
            setIsProgressActive(false)
            setIsDescriptionActive(false)
            setProgressChanged(false)
        }
    }

    const progressColor = (progress) => {
        if (Number(progress) <= 20) {
            return 'red'
        }
        if (Number(progress) <= 40) {
            return 'orange'
        }
        if (Number(progress) <= 80) {
            return 'blue'
        }
        if (Number(progress) > 80) {
            return 'green'
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} >


                <div className={styles.leftSide}>

                    <div className={styles.firstRow}>
                        <div className={styles.inputTitles}>
                            <span className={styles.pic1}>
                                <img src={pic1} alt="pic1" />
                            </span>
                            <span>
                                {
                                    (card === '') ?
                                        <span className={styles.nameContainer}>
                                            <input className={styles.createNameInput} placeholder={"Add Task Name"}
                                                onChange={e => setName(e.target.value)}

                                            />
                                            <button onClick={createTask} className={styles.editButton} >Create</button>
                                        </span>
                                        :
                                        <span>
                                            {
                                                isActive ?
                                                    <div ref={dropdownRef}>
                                                        <span className={styles.nameContainer}>
                                                            <input className={styles.nameInput} value={name} onChange={e => setName(e.target.value)} />
                                                            <button onClick={handleSubmit} className={styles.editButton} >Edit</button>
                                                        </span>
                                                    </div>
                                                    :
                                                    <span className={styles.nameContainer}>
                                                        <p className={styles.textName} onClick={() => setIsActive(!isActive)}>{card.name}</p>
                                                    </span>
                                            }
                                        </span>
                                }
                            </span>
                        </div >
                    </div>

                    <div className={styles.secondRowProgress} onClick={() => setIsProgressActive(true)}>
                        <div className={styles.inputTitles}>
                            <span className={styles.pic2}>
                                <img src={pic2} alt="pic2" />
                            </span>
                            <span className={styles.nameContainer}>
                                <p  >Progress</p>
                            </span>
                        </div>
                        <div>
                            {
                                (card === '') ?
                                    null
                                    :
                                    <span>
                                        {
                                            isProgressActive ?
                                                <div ref={dropdownRef}>
                                                    <span className={styles.progressInputContainer}>
                                                        <input type='number' className={styles.progressInput} value={progress} onChange={e => { setProgress(e.target.value); setProgressChanged(true) }} />
                                                        <button onClick={handleSubmit} className={styles.editButton} >Edit</button>
                                                    </span></div>
                                                :
                                                <div className={styles.progressDiv} >
                                                    {
                                                        card.progress ?
                                                            <div className={styles.bar} >
                                                                <div
                                                                    style={{
                                                                        width: `${card.progress}%`,
                                                                        backgroundColor: progressColor(card.progress)
                                                                    }}
                                                                    className={styles.progress}
                                                                />
                                                            </div> : null
                                                    }
                                                    <span className={styles.textName} >{card.progress} %</span>
                                                </div>

                                        }
                                    </span>
                            }
                        </div>

                    </div>


                    <div className={styles.thirdRow}>

                        <div className={styles.descriptinTitle}>
                            <p className={styles.text}>Description</p>
                        </div>
                        <textarea className={styles.descriptionInput}
                            ref={dropdownRef}
                            value={description}
                            onChange={(e) => { setDescription(e.target.value); setIsDescriptionActive(true) }}
                        />
                        <span>
                            {
                                (card === '') ?
                                    null
                                    :
                                    <span>
                                        {
                                            isDescriptionActive ?

                                                <div className={styles.descriptionButtons}>
                                                    <span>
                                                        <button onClick={handleSubmit} className={styles.editButton} >Edit</button>
                                                    </span>
                                                    <span>
                                                        <button onClick={(e) => { setDescription(card.description); setIsDescriptionActive(false) }} className={styles.editButton} >Cancel</button>
                                                    </span>

                                                </div>
                                                : null
                                        }
                                    </span>
                            }
                        </span>



                    </div>

                    <div className={styles.thirdRow}>

                        <div className={styles.descriptinTitle}>
                            <p className={styles.text}>History</p>
                        </div>
                        <TaskHistory taskHistory={taskHistory} />
                    </div>

                    <div className={styles.lasRow}>

                    </div>

                </div>

                <div className={styles.rightSide}>


                    <div className={styles.membersDiv}>
                        <div >
                            <p className={styles.text}>Members</p>
                        </div>
                        <div className={styles.members}>
                            {(card === '') ?
                                null
                                :
                                <TaskMembers
                                card={card}
                                size={30}
                                listId={listId}
                                project={props.project}
                                title={'Add'}
                                teamId={props.teamId}
                            />
                            }
                        </div>
                    </div>


                    <div className={styles.secondRow}>
                        <div >                           
                            <div className={styles.dueDate} >
                                {(card === '') ?
                                    null
                                    :
                                    <TaskDueDate
                                        cardDueDate={dueDate}
                                        cardId={cardId}
                                        listId={listId}
                                        project={props.project}
                                        showEditCard={false}
                                        teamId={params.teamid}
                                    />
                                }
                            </div>

                        </div>
                    </div>


                    <div className={styles.smallButtonsContainer}>
                        <div>
                            <p className={styles.text}>Add</p>
                        </div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic3} alt="pic3" />
                            Join</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic4} alt="pic4" />
                            Stickers</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic5} alt="pic5" />
                            Due Date</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic6} alt="pic6" />
                            Attach file</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic7} alt="pic7" />
                            Reports</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic10} alt="pic10" />
                            Add Teammate</div>
                    </div>


                    <div className={styles.smallButtonsContainer}>
                        <div>
                            <p className={styles.text}>Manage</p>
                        </div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic11} alt="pic11" />
                            Make Template</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic13} alt="pic13" />
                            Remove List</div>
                        <button className={styles.smallButtons} 
                        onClick={(e) => { deleteCard(e) }} title="Delete Task" >
                            <img className={styles.picsSmallButtons} src={pic12} alt="pic12" />
                         Delete Task</button>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic8} alt="pic8" />
                            Settings</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic9} alt="pic9" />
                            View</div>
                        <div className={styles.smallButtons} >
                            <img className={styles.picsSmallButtons} src={pic14} alt="pic14" />
                            Archive</div>
                    </div>

                </div>

            </form >
        </div >

    )
}

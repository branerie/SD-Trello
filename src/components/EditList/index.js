import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Title from '../Title'
import styles from './index.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useSocket } from '../../contexts/SocketProvider'
import ButtonClean from '../ButtonClean'
import { SketchPicker } from 'react-color'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import UserContext from '../../contexts/UserContext'
import isUserAdmin from '../../utils/isUserAdmin'
import ButtonGrey from '../ButtonGrey'
import useListsServices from '../../services/useListsServices'


export default function EditList(props) {
    const nameRef = useRef(null)
    const [nameHeight, setNameHeight] = useState(null)
    const [currInput, setCurrInput] = useState(null)
    const [name, setName] = useState(props.list.name)
    const socket = useSocket()
    const dropdownRef = useRef(null)
    const [isColorActive, setIsColorActive] = useDetectOutsideClick(dropdownRef)
    const [color, setColor] = useState(props.list.color || '#A6A48E')
    const [isAdmin, setIsAdmin] = useState(false)
    const members = props.project.membersRoles
    const userContext = useContext(UserContext)
    const params = useParams()
    const teamId = params.teamid
    const { editList } = useListsServices()
    
    useEffect(() => {
        setIsAdmin(isUserAdmin(userContext.user.id, members))
    }, [members, userContext.user.id])
    
    async function handleSubmit() {
        await editList(props.project._id, props.list._id, name, color)
        socket.emit('project-update', props.project)
        socket.emit('task-team-update', teamId)
        props.hideForm()
    }

    useEffect(() => {
        setTimeout(() => {
            setNameHeight(nameRef.current.scrollHeight + 2)
        }, 1);
    }, [])

    function onEscPressed(event, setElement, ref) {
        if (event.keyCode === 27) {
            setElement(currInput)
            setTimeout(() => {
                ref.current.blur()
            }, 1);
        }
    }

    return (
        <div className={styles.container} >
            <Title title='Edit List' />
            <div className={styles['input-container']}>
                <span className={styles.name}> Name</span>
                <textarea
                    ref={nameRef}
                    className={`${styles['name-input']} ${styles.text}`}
                    style={{ 'height': nameHeight }}
                    value={name}
                    onFocus={() => setCurrInput(name)}
                    onKeyDown={e => onEscPressed(e, setName, nameRef)}
                    onChange={e => {
                        setName(e.target.value)
                        setNameHeight(nameRef.current.scrollHeight + 2)
                    }}
                />
            </div>
            <div className={styles['change-color']}>
                <span className={styles['color-title']}>Color</span>
                <ButtonClean
                    className={styles['color-button']}
                    style={{ background: `${color}` }}
                    onClick={() => setIsColorActive(!isColorActive)}
                />
            </div>
            {isColorActive && <div ref={dropdownRef} >
                <SketchPicker
                    className={styles['color-pick']}
                    color={color} onChangeComplete={color => setColor(color.hex)}
                />
            </div>}
            <div className={styles['edit-list-button']}>
                {isAdmin &&
                    <ButtonGrey onClick={handleSubmit} title='Edit List' />

                }

            </div>
        </div>
    )
}
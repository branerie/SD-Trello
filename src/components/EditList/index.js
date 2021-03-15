import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import { SketchPicker } from 'react-color'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import Title from '../Title'
import ButtonClean from '../ButtonClean'
import ButtonGrey from '../ButtonGrey'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import isUserAdmin from '../../utils/isUserAdmin'
import useListsServices from '../../services/useListsServices'

const EditList = ({ list, project, hideForm }) => {
    const socket = useSocket()
    const nameRef = useRef(null)
    const { user } = useContext(UserContext)
    const [name, setName] = useState(list.name)
    const [nameHeight, setNameHeight] = useState(null)
    const [currInput, setCurrInput] = useState(null)
    const [color, setColor] = useState(list.color || '#A6A48E')
    const [isColorActive, setIsColorActive, dropdownRef] = useDetectOutsideClick()
    const [isAdmin, setIsAdmin] = useState(false)
    const { editList } = useListsServices()
    const members = project.membersRoles

    useEffect(() => {
        setIsAdmin(isUserAdmin(user.id, members))
    }, [members, user.id])

    const { teamid: teamId } = useParams()

    const handleSubmit = async () => {
        await editList(project._id, list._id, name, color)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
        hideForm()
    }

    useEffect(() => {
        if (nameRef.current) {
            setNameHeight(nameRef.current.scrollHeight + 2)
        }
    }, [])

    const onEscPressed = (event, setElement, ref) => {
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

export default EditList
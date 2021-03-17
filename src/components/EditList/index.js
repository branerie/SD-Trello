import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import { SketchPicker } from 'react-color'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import Title from '../Title'
import ButtonClean from '../ButtonClean'
import ButtonGrey from '../ButtonGrey'
import ResponsiveTextArea from '../Inputs/ResponsiveTextarea'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import useListsServices from '../../services/useListsServices'

const EditList = ({ list, project, hideForm }) => {
    const socket = useSocket()
    const [name, setName] = useState(list.name)
    const [color, setColor] = useState(list.color || '#A6A48E')
    const [isColorActive, setIsColorActive, dropdownRef] = useDetectOutsideClick()
    const { editList } = useListsServices()

    const { teamid: teamId } = useParams()

    const handleSubmit = async () => {
        await editList(project._id, list._id, name, color)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
        hideForm()
    }

    return (
        <div className={styles.container} >
            <Title title='Edit List' />
            <div className={styles['input-container']}>
                <span className={styles.name}>Name</span>
                <ResponsiveTextArea
                    value={name}
                    setValue={setName}
                    className={`${styles['name-input']} ${styles.text}`}
                    autoFocus={true}
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
                <ButtonGrey onClick={handleSubmit} title='Edit List' />
            </div>
        </div>
    )
}

export default EditList
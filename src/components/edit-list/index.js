import React, { useCallback, useRef, useState } from 'react'
import { useHistory } from "react-router-dom"
import Button from '../button'
import Input from '../input'
import Title from '../title'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import "react-datepicker/dist/react-datepicker.css"
import { useSocket } from '../../contexts/SocketProvider'
import ButtonClean from '../button-clean'
import { SketchPicker } from 'react-color'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'


export default function EditList(props) {
    const [name, setName] = useState(props.list.name)
    const history = useHistory()
    const socket = useSocket()
    const dropdownRef = useRef(null)
    const [isColorActive, setIsColorActive] = useDetectOutsideClick(dropdownRef)
    const [color, setColor] = useState(props.list.color || '#A6A48E')

    const projectId = props.project._id
    const listId = props.list._id

    const updateProjectSocket = useCallback(() => {
        socket.emit('project-update', props.project)
    }, [socket, props.project])

    async function handleSubmit(event) {
        event.preventDefault()
        const token = getCookie("x-auth-token")
        const response = await fetch(`/api/projects/lists/${projectId}/${listId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ name, color })
        })
        if (!response.ok) {
            history.push("/error")
        } else {
            updateProjectSocket()
            props.hideForm()
        }

    }

    const onColorChange = (color) => {
        setColor(color.hex)
        setIsColorActive(false)
    }

    return (
        <div className={styles.form}>
            <form className={styles.container} >
                <Title title="Edit List" />
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Name"
                    id="name"
                />
                <div className={styles.changeColor}>
                    <span>
                        Change Color:
                    </span>
                    <span className={styles.listColor}>
                        <ButtonClean
                            className={styles['color-button']}
                            style={{ background: `${color}` }}
                            onClick={() => setIsColorActive(!isColorActive)}
                        />
                    </span>
                </div>
                {isColorActive && <div ref={dropdownRef} >
                    <SketchPicker className={styles['color-pick']} color={color} onChangeComplete={onColorChange} />
                </div>}
                <Button onClick={handleSubmit} title="Edit List" />
            </form>
        </div>

    )
}
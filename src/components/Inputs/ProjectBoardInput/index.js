import React from 'react'
import styles from './index.module.css'
import { ESCAPE_KEY_CODE, ENTER_KEY_CODE } from '../../../utils/constats'

const ProjectBoardInput = ({ value, setValue, onEnter, onEscape, className }) => {

    const handleKeyDown = (event) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            setValue('')
            onEscape()
            return
        }

        if (event.keyCode === ENTER_KEY_CODE) {
            onEnter()
        }
    }

    return (
        <input
            autoFocus
            className={`${styles.input} ${className}`}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    )
}

export default ProjectBoardInput

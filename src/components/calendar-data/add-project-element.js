import React, { useRef, useState } from 'react'
import styles from './index.module.css'

const ENTER_KEY_CODE = 13
const ESCAPE_KEY_CODE = 27

const AddProjectElement = ({ handleSubmit, handleInputRemove, elementName, setElementName, placeholder }) => {
    const inputRef = useRef(null)
    const [nameHeight, setNameHeight] = useState(null)

    const handleChange = (event) => {
        if (event.keyCode === ENTER_KEY_CODE) {
            return
        }

        setElementName(event.target.value)
        setNameHeight(inputRef.current.scrollHeight + 2)
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            return handleInputRemove()
        }

        if (event.keyCode === ENTER_KEY_CODE) {
            return handleSubmit()
        }
    }

    return (
        <textarea
            value={elementName}
            ref={inputRef}
            placeholder={placeholder}
            className={styles.inputElementName}
            style={{ 'height': nameHeight, width: '100%' }}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onBlur={handleSubmit}
            autoFocus
        />
    )
}

export default AddProjectElement
import React, { useEffect, useRef, useState } from 'react'

const ESCAPE_KEY_CODE = 27
const ENTER_KEY_CODE = 13

const ResponsiveTextArea = ({ value, setValue, onBlur, onKeyDown, onSubmit, className, toggleActive }) => {
    const inputRef = useRef(null)
    const [areaHeight, setAreaHeight] = useState(null)
    const [currValue, setCurrValue] = useState(null)

    useEffect(() => {
        if (inputRef.current) {
            setAreaHeight(inputRef.current.scrollHeight + 2)
        }
        if(inputRef) {
            inputRef.current.focus()
        }
    }, [])

    const handleBlur = (event) => {
        if (onBlur) {
            return onBlur(event)
        }

        if (value === currValue) {
            return
        }

        onSubmit(event)
    }

    const handleKeyDown = (event) => {
        if (onKeyDown) {
            return onKeyDown(event)
        }

        if (event.keyCode === ESCAPE_KEY_CODE && toggleActive) {
            setValue(currValue)
            return toggleActive()
        }

        if (event.keyCode === ENTER_KEY_CODE) {
            onSubmit(event)
        }
    }

    const onChange = (event) => {
        setAreaHeight(inputRef.current.scrollHeight + 2)
        setValue(event.target.value)
    }

    return (
        <textarea
            ref={inputRef}
            className={className}
            style={{ 'height': areaHeight }}
            value={value}
            onKeyDown={handleKeyDown}
            onChange={onChange}
            onBlur={handleBlur}
            onFocus={() => setCurrValue(value)}
        />
    )
}

export default ResponsiveTextArea
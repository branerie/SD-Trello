import React, { useEffect, useMemo, useRef, useState } from 'react'

const ESCAPE_KEY_CODE = 27
const ENTER_KEY_CODE = 13

const ResponsiveTextArea = ({ value, setValue, onBlur, onKeyDown, onSubmit, className, toggleActive }) => {
    const inputRef = useRef(null)
    const [areaHeight, setAreaHeight] = useState(null)

    const initValue = useMemo(() => value, [value])

    useEffect(() => {
        if (inputRef.current) {
            setAreaHeight(inputRef.current.scrollHeight + 2)

        }
    }, [inputRef.current && inputRef.current.scrollHeight])

    const handleBlur = (event) => {
        if (onBlur) {
            return onBlur(event)
        }

        if (value === initValue) {
            return
        }

        onSubmit(event)
    }

    const handleKeyDown = (event) => {
        if (onKeyDown) {
            return onKeyDown(event)
        }

        if (event.keyCode === ESCAPE_KEY_CODE && toggleActive) {
            return toggleActive()
        }

        if (event.keyCode === ENTER_KEY_CODE) {
            onSubmit(event)
        }
    }

    return (
        <textarea
            ref={inputRef}
            className={className}
            style={{ 'height': areaHeight }}
            value={value}
            onKeyDown={handleKeyDown}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
        />
    )
}

export default ResponsiveTextArea
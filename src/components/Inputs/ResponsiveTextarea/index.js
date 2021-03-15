import React, { useEffect, useRef, useState } from 'react'

const ESCAPE_KEY_CODE = 27
const ENTER_KEY_CODE = 13

const ResponsiveTextArea = ({
    value,
    setValue,
    onBlur,
    onKeyDown,
    onSubmit,
    className,
    toggleActive,
    autoFocus
}) => {
    const inputRef = useRef(null)
    const [areaHeight, setAreaHeight] = useState(null)
    const [currValue, setCurrValue] = useState(null)

    useEffect(() => {
        if (inputRef.current) {
            setAreaHeight(inputRef.current.scrollHeight + 2)
        }

        if (inputRef.current && autoFocus) {
            inputRef.current.focus()
        }
    }, [autoFocus])

    const handleBlur = () => {
        if (!onBlur || value === currValue) {
            return
        }

        onBlur()
    }

    const handleKeyDown = (event) => {
        if (onKeyDown) {
            return onKeyDown(event)
        }

        if (event.keyCode === ESCAPE_KEY_CODE) {
            setValue(currValue)

            if (toggleActive) {
                return toggleActive()
            }

            if (inputRef.current) {
                // needs setTimeout in order to call handleBlur after setValue(currValue)
                setTimeout(() => {  
                    inputRef.current.blur()
                }, 1)
            }

            return
        }

        if (event.keyCode === ENTER_KEY_CODE) {
            if (value === currValue) {
                inputRef.current.blur()

                if (toggleActive) {
                    toggleActive()
                }

                return
            }
            
            if (onSubmit) {
                onSubmit(event)
            }

            inputRef.current.blur()
        }
    }

    const onChange = (event) => {
        setAreaHeight(inputRef.current.scrollHeight + 2)
        setValue(event.target.value)
    }

    const onFocus = () => {
        setCurrValue(value)
        const length = value.length
        inputRef.current.setSelectionRange(length, length)
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
            onFocus={onFocus}
        />
    )
}

export default ResponsiveTextArea
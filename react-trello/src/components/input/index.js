import React from "react"

const Input = ({ label, id, value, onChange, onFocus, onBlur, type, placeholder }) => {
    return (
        <div>
            <label htmlFor={id}>
                {label}:
                <input type={type || "text"} id={id} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder={placeholder}/>
            </label>
        </div>
    )
}

export default Input;
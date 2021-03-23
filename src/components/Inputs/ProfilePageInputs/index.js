import React from 'react'
import ButtonGrey from '../../ButtonGrey'
import styles from './index.module.css'


const ProfilePageInputs = ({
    className,
    classNameDiv,
    title,
    onClick,
    onChange,
    placeholder,
    disabled,
    type,
    value
}) => {

    return (
        <div className={styles['button-input-div']} classNameDiv={classNameDiv}>
            <ButtonGrey
                title={title}
                className={styles['navigate-buttons']}
                onClick={onClick}
            />
            < input
                onChange={onChange}
                className={className}
                placeholder={placeholder}
                disabled={disabled}
                type={type}
                value={value}
            />
        </div>
    )
}

export default ProfilePageInputs

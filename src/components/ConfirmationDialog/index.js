import React from 'react'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import ButtonGrey from '../ButtonGrey'

const ConfirmDialog = ({ title, hideConfirm, onConfirm, onDecline }) => {
    const accept = () => {
        hideConfirm()
        onConfirm()
    }

    const decline = () => {
        hideConfirm()
        if (onDecline) onDecline()
    }

    return (
        <>
            <div className={styles['transparent-confirm']}></div>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img src={logo} alt='logo' width='194' height='142' />
                </div>
                <div className={styles.title}>{`Are you sure you want to ${title}?`}</div>
                <div className={styles.buttons}>
                    <ButtonGrey
                        className={styles.button}
                        title={'Yes'}
                        onClick={accept}
                    />
                    <ButtonGrey
                        className={styles.button}
                        title={'No'}
                        onClick={decline}
                    />
                </div>
            </div>
        </>
    )
}

export default ConfirmDialog
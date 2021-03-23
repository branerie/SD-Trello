import React, { useCallback, useEffect } from 'react'
import styles from './index.module.css'
import ButtonGrey from '../ButtonGrey'
import logo from '../../images/logo.svg'
import { ESCAPE_KEY_CODE, ENTER_KEY_CODE } from '../../utils/constats'

const ConfirmDialog = ({ title, hideConfirm, onConfirm, onDecline }) => {
    const accept = useCallback(() => {
        hideConfirm()
        onConfirm()
    }, [hideConfirm, onConfirm])

    const decline = useCallback(() => {
        hideConfirm()
        
        if (onDecline) onDecline()
    }, [hideConfirm, onDecline])

    useEffect(() => {
        const onKeyPress = (event) => {
            
            if (event.keyCode === ESCAPE_KEY_CODE) {
                decline()
                return
            }
            
            if (event.keyCode === ENTER_KEY_CODE) {
                accept()
                return
            }
        }

        document.addEventListener('keydown', onKeyPress)
        
        return () => document.removeEventListener('keydown', onKeyPress)
    }, [accept, decline])
    
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
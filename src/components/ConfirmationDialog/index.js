import React from 'react'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import ButtonGrey from '../ButtonGrey'




const ConfirmDialog = (props) => {
  return (
    <>
      <div className={styles['transparent-confirm']}></div>
      <div className={styles.container}>

        <div className={styles.content}>



          <div className={styles.logo}>
            <img src={logo} alt="logo" width='194' height='142' />
          </div>

          <div className={styles.title}>{`Are you sure you want to ${props.title}?`}</div>
          <div className={styles.buttons}>
            <ButtonGrey
              className={styles.button}
              title={'Yes'}
              onClick={() => {
                props.hideConfirm();
                props.onConfirm()
              }
              }
            />
            <ButtonGrey
              className={styles.button}
              title={'No'}
              onClick={() => props.hideConfirm()}
            />

          </div>

        </div>

      </div>
    </>

  )
}
export default ConfirmDialog;
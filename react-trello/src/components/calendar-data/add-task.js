import React, { useCallback, useContext, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSocket } from '../../contexts/SocketProvider'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import styles from './index.module.css'
import getCookie from '../../utils/cookie'
import ButtonClean from '../button-clean'
import Transparent from '../transparent'
import CreateCard from '../create-card'



export default function AddTask(props) {

   
    const [isVisible, setIsVisible] = useState(false)
    
    const listRef = useRef(null);
   


    return (


        <div className={styles.flexend}>
            <ButtonClean
                className={styles.addnote}
                onClick={() => setIsVisible(!isVisible)}
                title='+ Add Task'
            />
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={() => setIsVisible(!isVisible)}>
                            <CreateCard hideForm={() => setIsVisible(!isVisible)} listId={ props.listId} project={props.project} />
                        </Transparent>
                    </div> : null
            }
        </div>
    )
}
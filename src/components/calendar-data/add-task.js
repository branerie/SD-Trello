import React, { useState } from 'react'
import styles from './index.module.css'
import ButtonClean from '../button-clean'
import Transparent from '../transparent'
import CreateCard from '../create-card'



export default function AddTask(props) {

   
    const [isVisible, setIsVisible] = useState(false)
    
 
    return (


        <div className={styles.flexend}>
            <ButtonClean
                className={styles.cursorPointer}
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
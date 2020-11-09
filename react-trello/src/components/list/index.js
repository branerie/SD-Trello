import React, { useState } from 'react'
import SubmitButton from '../button/submit-button'
import CreateCard from '../create-card'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function List(props) {
    const [isVisible, setIsVisible] = useState(false)

    const mapCards = (element) => {
        const date = new Date(element.dueDate)

        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()


        return (
            <div className={styles.card}>
                <div>{element.name}</div>
                {
                    element.dueDate ? <div>{`${day}-${month}-${year}`}</div> : null
                }
                {
                    element.progress ? <div>{element.progress}%</div> : null
                }
                <div>{element.members.map(element => {
                    return (<span className={styles.users}>{element.username}</span>)
                })}</div>
            </div>
        )
    }
  
    const showForm = () => {
        setIsVisible(true)
    }

    const hideForm = () => {
        setIsVisible(false)
    }

    return (
        <div className={styles.list}>
            <div>
                {props.list.name}
            </div>
            {
                props.list.cards.map(mapCards)
            }
            <SubmitButton title='Add card' onClick={showForm} />
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={hideForm}>
                            <CreateCard hideForm={hideForm} listId={props.list._id} />
                        </Transparent>
                    </div> : null
            }
        </div>
    )
}

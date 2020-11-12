import React, { useState } from 'react'
import SubmitButton from '../button/submit-button'
import Card from '../card'
import CreateCard from '../create-card'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function List(props) {
    const [isVisible, setIsVisible] = useState(false)

    const showForm = () => {
        setIsVisible(true)
    }

    const hideForm = () => {
        setIsVisible(false)
    }

    return (
        <div className={styles.list} key={props.list._id}>
            <div>
                {props.list.name}
            </div>
            {
                props.list.cards.map((element, index) => {
                    return <Card key={index} card={element} listId={props.list._id} project={props.project}/>
                })
            }
            <SubmitButton title='Add card' onClick={showForm} />
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={hideForm}>
                            <CreateCard hideForm={hideForm} listId={props.list._id} project={props.project}/>
                        </Transparent>
                    </div> : null
            }
        </div>
    )
}

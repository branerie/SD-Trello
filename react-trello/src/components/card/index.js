import React, { useState } from 'react'
import EditCard from '../edit-card'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function Card({ card, listId }) {

    const [IsVisibleEdit, setIsVisibleEdit] = useState(false)

    const date = new Date(card.dueDate)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const showFormEdit = () => {
        setIsVisibleEdit(true)
    }

    const hideFormEdit = () => {
        setIsVisibleEdit(false)
    }

    return (
        <div className={styles.card} >
            <div>{card.name}</div>
            {
                card.dueDate ? <div>{`${day}-${month}-${year}`}</div> : null
            }
            {
                card.progress ? <div>{card.progress}%</div> : null
            }
    
            <div>{card.members.map(element => {
                return (<span className={styles.users} key={element._id}>{element.username}</span>)
            })}</div>
    
            <button title='Edit' onClick={() => showFormEdit()} className={styles.editButton}>Edit</button>
            { IsVisibleEdit ?
                < div >
                    <Transparent hideFormEdit={hideFormEdit} >
                        <EditCard hideFormEdit={hideFormEdit} card={card} listId={listId} />
                    </Transparent >
                </div > : null
            }
        </div >
    )
}
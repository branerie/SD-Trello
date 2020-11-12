import React, { useState } from 'react'
import SubmitButton from '../button/submit-button'
import CreateCard from '../create-card'
import EditCard from '../edit-card'
import Transparent from '../transparent'
import styles from './index.module.css'

export default function List(props) {
    const [isVisible, setIsVisible] = useState(false)
    const [IsVisibleEdit, setIsVisibleEdit] = useState(false)
    const [currentCard, setCurrentCard] = useState("")

    
    const mapCards = (element) => {
        const date = new Date(element.dueDate)

        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        const card = element




        const showFormEdit = (card) => {
            setIsVisibleEdit(true)
            setCurrentCard(card)
        }

        const hideFormEdit = () => {
            setIsVisibleEdit(false)
        }


        return (
            <div className={styles.card} key={card._id}>
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

                <button title='Edit' onClick={() => showFormEdit(card)} className={styles.editButton}>Edit</button>
                { IsVisibleEdit ?
                    < div >
                        <Transparent hideFormEdit={hideFormEdit} >
                            <EditCard hideFormEdit={hideFormEdit} card={currentCard} listId={props.list._id} />
                        </Transparent >
                    </div > : null
                }
            </div >
        )
    }



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
                props.list.cards.map(mapCards)
            }
            <SubmitButton title='Add card' onClick={showForm} />
            {
                isVisible ?
                    <div>
                        <Transparent hideForm={hideForm}>
                            <CreateCard hideForm={hideForm} listId={props.list._id} updateProjectSocket={props.updateProjectSocket}/>
                        </Transparent>
                    </div> : null
            }
        </div>
    )
}

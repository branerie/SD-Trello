import React, { useContext, useState } from 'react'
import ProjectContext from '../../contexts/ProjectContext'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import useListsServices from '../../services/useListsServices'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

const AddProjectBoardList = () => {
    const projectContext = useContext(ProjectContext)
    const socket = useSocket()
    const [listName, setListName] = useState('')
    const [isAddListActive, setIsAddListActive, listRef] = useDetectOutsideClick()
    const { createList } = useListsServices()

    const addList = async () => {
        if (listName === '') return

        await createList(projectContext.project._id, listName)
        setIsAddListActive(!isAddListActive)
        setListName('')
        socket.emit('project-update', projectContext.project)
    }

    return (
        <div className={styles.list} >
            { isAddListActive ?
                <div ref={listRef} className={styles.container} >
                    <input
                        autoFocus
                        className={styles.input}
                        type={'text'}
                        value={listName}
                        onChange={e => setListName(e.target.value)}
                    />
                    <ButtonClean
                        className={styles.button}
                        onClick={addList}
                        title='+ Add List'
                    />
                </div>
                :
                <ButtonClean
                    className={styles.button}
                    onClick={() => setIsAddListActive(!isAddListActive)}
                    title='+ Add List'
                />
            }
        </div>
    )
}

export default AddProjectBoardList


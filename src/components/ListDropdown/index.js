import React, { useState } from 'react'
import { useParams } from 'react-router'
import { useSocket } from '../../contexts/SocketProvider'
import styles from './index.module.css'
import ButtonGrey from '../ButtonGrey'
import ConfirmDialog from '../ConfirmationDialog'
import EditList from '../EditList'
import Transparent from '../Transparent'
import useListsServices from '../../services/useListsServices'

const ListDropdown = ({
    project,
    list,
    isDropdownActive,
    setIsDropdownActive,
    dropdownRef,
    setIsDragListDisabled
}) => {
    const socket = useSocket()
    const params = useParams()
    const teamId = params.teamid
    const [isVisibleEditList, setIsVisibleEditList] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { deleteList } = useListsServices()

    const handleDeleteList = async () => {
        await deleteList(project._id, list._id)
        socket.emit('project-update', project)
        socket.emit('task-team-update', teamId)
    }

    const editList = () => {
        setIsVisibleEditList(true)
        setIsDropdownActive(!isDropdownActive)
        setIsDragListDisabled(true)
    }

    const hideForm = () => {
        setIsDragListDisabled(false)
        setIsVisibleEditList(!isVisibleEditList)
    }

    return (
        <div>
            <div className={styles.relative}>
                {isDropdownActive && <div ref={dropdownRef} className={`${styles.menu}`} >
                    <ButtonGrey
                        onClick={editList}
                        title='Edit'
                        className={styles.edit}
                    />
                    <ButtonGrey
                        onClick={() => {
                            setIsConfirmOpen(true)
                            setIsDragListDisabled(true)
                        }}
                        title='Delete'
                        className={styles.delete}
                    />
                </div>}
            </div>

            {isVisibleEditList &&
                <Transparent hideForm={hideForm} >
                    <EditList hideForm={hideForm} list={list} project={project} />
                </Transparent >
            }

            {isConfirmOpen &&
                <ConfirmDialog
                    title={'you wish to delete this list'}
                    hideConfirm={() => setIsConfirmOpen(false)}
                    onConfirm={() => {
                        handleDeleteList()
                        setIsDragListDisabled(false)
                    }}
                    onDecline={() => setIsDragListDisabled(false)}
                />
            }
        </div>
    )
}

export default ListDropdown
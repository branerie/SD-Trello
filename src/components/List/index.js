import React, { useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import styles from './index.module.css'
import ButtonClean from '../ButtonClean'
import Card from '../Card'
import ListColor from '../ListColor'
import ListDropdown from '../ListDropdown'
import AddProjectBoardTask from '../AddProjectBoardTask'
import dotsPic from '../../images/dots.svg'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

const List = ({ isAdmin, project, list, setIsDragListDisabled }) => {
    const [isDragCardDisabled, setIsDragCardDisabled] = useState(false)
    const [isDropdownActive, setIsDropdownActive, dropdownRef] = useDetectOutsideClick()

    return (
        <>
            <div className={styles.list}>
                <div className={styles.header}>
                    <div>
                        <div className={styles.name} title={list.name} >{list.name}</div>
                        <ListColor color={list.color || '#A6A48E'} type={'list'} />
                    </div>
                    {isAdmin &&
                        <ButtonClean
                            className={styles.button}
                            onClick={() => setIsDropdownActive(!isDropdownActive)}
                            title={<img src={dotsPic} alt='' width='20'/>}
                        />
                    }
                </div>
                <ListDropdown
                    project={project}
                    list={list}
                    isDropdownActive={isDropdownActive}
                    setIsDropdownActive={setIsDropdownActive}
                    dropdownRef={dropdownRef}
                    setIsDragListDisabled={setIsDragListDisabled}
                />
                <Droppable droppableId={list._id} type='droppableSubItem'>
                    {(provided) => (
                        <div className={styles.droppable} ref={provided.innerRef}>
                            {list.cards.map((element, index) => {
                                return (
                                    <Draggable
                                        key={element._id}
                                        draggableId={element._id}
                                        index={index}
                                        isDragDisabled={isDragCardDisabled ? true : false}
                                    >
                                        {(provided) => (<>
                                            <div
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                            >
                                                <Card
                                                    card={element}
                                                    project={project}
                                                    listId={list._id}
                                                    setIsDragCardDisabled={setIsDragCardDisabled}
                                                    setIsDragListDisabled={setIsDragListDisabled}
                                                />
                                            </div>
                                            {provided.placeholder}
                                        </>)}
                                    </Draggable>
                                )
                            })
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <AddProjectBoardTask project={project} listId={list._id} />
            </div>
        </>
    )
}

export default List
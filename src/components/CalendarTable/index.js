import React, { useCallback, useEffect, useState, useContext } from 'react'
import styles from './index.module.css'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useParams } from 'react-router-dom'
import TaskName from '../CalendarData/TaskName'
import TaskProgress from '../CalendarData/TaskProgress'
import TaskDueDate from '../CalendarData/TaskDueDate'
import AddTask from '../CalendarData/AddTask'
import AddList from '../CalendarData/AddList'
import ProjectContext from '../../contexts/ProjectContext'
import assembleColumnData from '../CalendarData/columnData'
import Transparent from '../Transparent'
import EditList from '../EditList'
import UserContext from '../../contexts/UserContext'
import TaskFilters from '../CalendarData/TaskFilters'
import MembersList from '../MembersList'
import TableDateNavigation from '../TableDateNavigation'
import ButtonClean from '../ButtonClean'
import { formatDate, getDateWithOffset, getMonday } from '../../utils/date'
import { createTableEntry, parseCardHistory, applyCardFilters, getCardsSortMethod } from './utils'

const TableDndApp = ({ project }) => {
    const projectContext = useContext(ProjectContext)
    const userContext = useContext(UserContext)
    const params = useParams()
    const [startDate, setStartDate] = useState(getMonday())
    const [tableData, setTableData] = useState([])
    const [currList, setCurrList] = useState('')
    const [newEntries, setNewEntries] = useState(null)
    const [sortCriteria, setSortCriteria] = useState({ columnName: null, isDescending: false })
    const [filter, setFilter] = useState({
        progress: { notStarted: true, inProgress: true, done: true },
        member: null,
        dueBefore: null,
        isUsed: false
    })

    const onListClick = useCallback((list) => {
        const member = projectContext.project.membersRoles.find(m => 
                            m.memberId._id === userContext.user.id)                    

        if (member && member.admin) {
            setCurrList(list)
        }

        projectContext.setLists(projectContext.project.lists)
    }, [projectContext, userContext.user.id])

    const updateTableData = useCallback(() => {
        const data = []
        const lists = project.lists
        projectContext.setLists(lists)
        const cardsSortMethod = getCardsSortMethod(sortCriteria.columnName, sortCriteria.isDescending)

        lists.forEach((list, histIndex) => {
            if (projectContext.hiddenLists.includes(list._id)) {
                return
            }

            data.push(createTableEntry({
                task: (
                    <div 
                        key={histIndex} 
                        className={styles.listNameContainer} 
                        style={{ background: list.color || '#A6A48E' }}
                        onClick={() => onListClick(list)}
                    >
                        <span className={styles.listNameText} >
                            {list.name}
                        </span>
                    </div>
                ),
                dueDate: (
                    <div onClick={() => setNewEntries({ newTask: list._id })} className={styles.addTask}>
                        {/* <AddTask listId={list._id} project={project} /> */}
                        + Add Task
                    </div>
                )
            }))

            let listCards = list.cards.filter(card => applyCardFilters(card, filter))
            if (sortCriteria.columnName) {
                listCards = listCards.sort(cardsSortMethod)
            }

            listCards.forEach(card => {
                const cardDueDate = card.dueDate ? new Date(card.dueDate) : ''
                // const historyArr2 = parseCardHistory(card.history)
                const historyByDate = parseCardHistory(card.history)

                const cellData = {
                    date: cardDueDate,
                    // history: historyArr2,
                    history: historyByDate,
                    progress: card.progress
                }

                const weekdayData = JSON.stringify(cellData)

                data.push(createTableEntry({
                    task:
                        (
                            <TaskName
                                // value={card.name + '/' + card._id + '/' + list._id}
                                card={card} listId={list._id}
                                project={project} />
                        ),
                    progress:
                        (
                            <TaskProgress
                                value={card.progress + '/' + card._id + '/' + list._id}
                                listId={list._id}
                                project={project} card={card} />
                        ),
                    assigned:
                        (
                            <MembersList
                                members={card.members}
                                maxLength={2}
                            />
                        ),
                    monday: weekdayData,
                    tuesday: weekdayData,
                    wednesday: weekdayData,
                    thursday: weekdayData,
                    friday: weekdayData,
                    saturday: weekdayData,
                    sunday: weekdayData,
                    dueDate: (
                        <TaskDueDate
                            value={cardDueDate ? formatDate(cardDueDate, '%d-%m-%Y') : ''}
                            cardDueDate={cardDueDate}
                            cardId={card._id}
                            listId={list._id}
                            project={project}
                            card={card}
                            teamId={params.teamid}
                        />
                    )
                }))
            })

            if (newEntries && newEntries.newTask && newEntries.newTask === list._id) {
                data.push(createTableEntry({
                    task: (
                        <AddTask
                            listId={list._id}
                            project={project}
                            handleInputRemove={() => setNewEntries(null)}
                        />
                    )
                }))
            }
        })

        if (newEntries && newEntries.newList) {
            data.push(createTableEntry({
                task: (
                    <AddList project={project} handleInputRemove={() => setNewEntries(null)} />
                )
            }))
        }

        /* 
        Rows need to be reversed if descending sort as by default ReactTable simply reverses 
        the data if descending sort is selected, expecting the data to already be sorted in 
        ascending order. However, this puts the list names below their respective tasks, 
        so we need to do this terrible hack of pre-reversing the data in that case.
        Possible solution to avoid this 'hack' is to switch to subcomponents in ReactTable
        and make each list a subtable. Then the sort should act per-subcomponent 
        */
        setTableData(sortCriteria.isDescending ? data.reverse() : data)
    }, [filter, onListClick, params.teamid, projectContext, project, newEntries, sortCriteria.columnName, sortCriteria.isDescending])

    useEffect(() => {
        updateTableData()
    }, [filter, project, projectContext.hiddenLists, sortCriteria, updateTableData])

    const changeStartDate = (dayDiff) => {
        const newStartDate = getDateWithOffset(startDate, dayDiff)
        setStartDate(newStartDate)
    }

    return (
        <div className={styles.pageContainer}>
            { currList &&
                    < div >
                        <Transparent hideForm={() => setCurrList('')} >
                            <EditList 
                                hideForm={() => setCurrList('')} 
                                list={currList}
                                 project={project} 
                            />
                        </Transparent >
                    </div >
            }
            <div className={styles.buttoDiv}>
                <TaskFilters filter={filter} setFilter={setFilter} />
                <TableDateNavigation 
                    startDate={startDate}
                    setStartDate={setStartDate}
                    changeStartDate={changeStartDate}
                />
                {/* <AddList project={project} /> */}
                <ButtonClean   
                    className={styles.addListButton} 
                    onClick={() => setNewEntries({ newList: true })} 
                    title='+ Add List'
                />
            </div>
            <div>
                {/* <DragDropContext onDragEnd={handleDragEnd} > */}
                <ReactTable
                    // TrComponent={DragTrComponent}
                    // TbodyComponent={DropTbodyComponent}
                    // getTrProps={getTrProps}
                    data={tableData}
                    columns={
                        assembleColumnData(startDate)
                    }
                    defaultPageSize={10}
                    pageSize={tableData.length}
                    showPagination={false}
                    background={
                        'white'
                    }
                    className={`${styles.reactTable} -highlight`}
                    getTbodyProps={() => ({ className: styles.reactTableBody })}
                    getTrGroupProps={() => ({ className: styles.reactTableTrGroup })}
                    onSortedChange={(sortInfo) => {
                        const { id: columnName, desc: isDescending } = sortInfo[0]
                        setSortCriteria({ columnName, isDescending })
                    }}
                />

                {/* </DragDropContext> */}
            </div>
        </div>
    )
}

export default TableDndApp


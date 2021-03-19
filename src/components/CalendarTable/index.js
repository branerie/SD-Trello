import React, { useCallback, useEffect, useState, useContext } from 'react'
import ReactTable from 'react-table'
import { useParams } from 'react-router-dom'
import 'react-table/react-table.css'
import 'react-datepicker/dist/react-datepicker.css'
import ProjectContext from '../../contexts/ProjectContext'
import UserContext from '../../contexts/UserContext'
import styles from './index.module.css'
import TaskName from '../CalendarData/TaskName'
import TaskDueDate from '../CalendarData/TaskDueDate'
import AddTask from '../CalendarData/AddTask'
import AddList from '../CalendarData/AddList'
import assembleColumnData from '../CalendarData/columnData'
import Transparent from '../Transparent'
import EditList from '../EditList'
import TaskFilters from '../CalendarData/TaskFilters'
import MembersList from '../MembersList'
import TableDateNavigation from '../CalendarData/TableDateNavigation'
import ButtonClean from '../ButtonClean'
import ProgressInput from '../Inputs/ProgressInput'
import { formatDate, getDateWithOffset, getMonday } from '../../utils/date'
import { createTableEntry, parseCardHistory, applyCardFilters, getCardsSortMethod } from './utils'
import checkIsUserAdmin from '../../utils/checkIsUserAdmin'

const CalendarTable = () => {
    const { project, setLists, hiddenLists } = useContext(ProjectContext)
    const { user } = useContext(UserContext)
    const { teamid: teamId } = useParams()
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
        const isUserAdmin = checkIsUserAdmin(user.id, project.membersRoles)

        if (isUserAdmin) {
            setCurrList(list)
        }
    }, [project, user.id])

    const updateTableData = useCallback(() => {
        const data = []
        const lists = project.lists
        setLists(lists)
        const cardsSortMethod = getCardsSortMethod(sortCriteria.columnName, sortCriteria.isDescending)

        lists.forEach((list, histIndex) => {
            if (hiddenLists.includes(list._id)) {
                return
            }

            data.push(createTableEntry({
                task: (
                    <div
                        key={histIndex}
                        className={styles['list-name-container']}
                        style={{ background: list.color || '#A6A48E' }}
                        onClick={() => onListClick(list)}
                    >
                        <span className={styles['list-name-text']} >
                            {list.name}
                        </span>
                    </div>
                ),
                dueDate: (
                    <div
                        className={styles['add-task']}
                        onClick={() => setNewEntries({ newTask: list._id })}
                    >
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
                const historyByDate = parseCardHistory(card.history)

                const cellData = {
                    date: cardDueDate,
                    history: historyByDate,
                    progress: card.progress
                }

                const weekdayData = JSON.stringify(cellData)

                data.push(createTableEntry({
                    task:
                        (
                            <TaskName
                                card={card}
                                listId={list._id}
                                project={project}
                            />
                        ),
                    progress:
                        (
                            <ProgressInput
                                card={card}
                                listId={list._id}
                                project={project}
                                teamId={teamId}
                                inputClassName={styles['progress-input']}
                                placeholderClassName={styles['progress-placeholder']}
                                isBackgroundStyled={true}
                            />
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
                            formatedDueDate={cardDueDate ? formatDate(cardDueDate, '%d-%m-%Y') : ''}
                            dueDate={cardDueDate}
                            listId={list._id}
                            project={project}
                            card={card}
                            teamId={teamId}
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
    }, [filter, onListClick, teamId, hiddenLists, setLists, project, newEntries, sortCriteria.columnName, sortCriteria.isDescending])

    useEffect(() => {
        updateTableData()
    }, [filter, project, hiddenLists, sortCriteria, updateTableData])

    const changeStartDate = (dayDiff) => {
        const newStartDate = getDateWithOffset(startDate, dayDiff)
        setStartDate(newStartDate)
    }

    return (
        <div className={styles['page-container']}>
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
            <div className={styles['button-div']}>
                <TaskFilters filter={filter} setFilter={setFilter} />
                <TableDateNavigation
                    startDate={startDate}
                    setStartDate={setStartDate}
                    changeStartDate={changeStartDate}
                />
                <ButtonClean
                    className={styles['add-list-button']}
                    onClick={() => setNewEntries({ newList: true })}
                    title='+ Add List'
                />
            </div>
            <div>
                <ReactTable
                    data={tableData}
                    columns={assembleColumnData(startDate)}
                    defaultPageSize={10}
                    pageSize={tableData.length}
                    showPagination={false}
                    background={'white'}
                    className={`${styles['react-table']} -highlight`}
                    getTbodyProps={() => ({ className: styles['react-table-body'] })}
                    getTrGroupProps={() => ({ className: styles['react-table-tr-group'] })}
                    onSortedChange={(sortInfo) => {
                        const { id: columnName, desc: isDescending } = sortInfo[0]
                        setSortCriteria({ columnName, isDescending })
                    }}
                />
            </div>
        </div>
    )
}

export default CalendarTable
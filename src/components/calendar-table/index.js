import React, { useCallback, useEffect, useState, useContext } from "react";
import styles from './index.module.css'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker"
import TaskName from '../calendar-data/task-name'
import TaskProgress from "../calendar-data/task-progress"
import TaskDueDate from "../calendar-data/task-dueDate"
import AddList from "../calendar-data/add-list"
import AddTask from "../calendar-data/add-task"
import TaskMembers from "../calendar-data/task-members"
import ProjectContext from "../../contexts/ProjectContext"
import ColumnData from "../calendar-data/column-data"
import Transparent from "../transparent"
import EditList from "../edit-list"
import UserContext from '../../contexts/UserContext'
import { useParams } from "react-router-dom"
import previous from '../../images/project-list/previous-day.svg'
import next from '../../images/project-list/next-day.svg'
import MembersList from "../members-list";

const createTableEntry = (entryData) => {
    return {
        task: entryData.task || '',
        progress: entryData.progress || '',
        assigned: entryData.assigned || '',
        monday: entryData.monday || '',
        tuesday: entryData.tuesday || '',
        wednesday: entryData.wednesday || '',
        thursday: entryData.thursday || '',
        friday: entryData.friday || '',
        saturday: entryData.saturday || '',
        sunday: entryData.sunday || '',
        dueDate: entryData.dueDate || ''
    }
}

const TableDndApp = (props) => {
    const [startDate, setStartDate] = useState(getMonday())
    const [tableData, setTableData] = useState([])
    const [currList, setCurrList] = useState('')
    const projectContext = useContext(ProjectContext)
    const userContext = useContext(UserContext)
    const params = useParams()

    const onListClick = useCallback((list) => {
        const member = projectContext.project.membersRoles.find(m => 
                            m.memberId._id === userContext.user.id)                    

        if (member && member.admin) {
            setCurrList(list)
        }

        projectContext.setLists(projectContext.project.lists)
    }, [projectContext, userContext.user.id])


    const updateTableData = () => {
        const data = []
        const lists = props.project.lists
        projectContext.setLists(lists)

        lists.forEach((list, index) => {
            if (projectContext.hiddenLists.includes(list._id)) {
                return
            }

            data.push(createTableEntry({
                task: (
                    <div 
                        key={index} 
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
                    <div>
                        <AddTask listId={list._id} project={props.project} />
                    </div>
                )
            }))

            let listCards = list.cards.filter(card => {
                let cardFilter = false
                if (props.filter.bool['Not Started'] && 
                    (card.progress === 0 || card.progress === null)) {
                    cardFilter = true
                }

                if (props.filter.bool['In Progress'] && card.progress > 0 && card.progress < 100) {
                    cardFilter = true
                }
                
                if (props.filter.bool['Done'] && card.progress === 100) {
                    cardFilter = true
                }

                const userFilter = props.filter.member 
                                        ? card.members.some(m => m._id === props.filter.member.id) 
                                        : true

                return cardFilter && userFilter
            })

            listCards.forEach(card => {

                let cardDate = ''
                let thisCardDate = ''
                if (card.dueDate) {
                    cardDate = new Date(card.dueDate)
                    thisCardDate = cardDate.getTime()
                }

                let historyArr
                if (card.history) {
                    historyArr = []
                    let taskHistory = card.history
                    for (let i = 0; i < taskHistory.length; i++) {
                        let currElement = taskHistory[i]

                        if (i === taskHistory.length - 1) {
                            historyArr.push(`${currElement.date}*${currElement.event}`)
                            break;
                        }

                        const currElementSlice = currElement.event.slice(0, 8)
                        const taskHistorySlice = taskHistory[i + 1].event.slice(0, 8)
                        if (currElementSlice === taskHistorySlice && currElement.date === taskHistory[i + 1].date) {

                        } else {
                            historyArr.push(`${currElement.date}*${currElement.event}`)
                        }
                    }
                } else {
                    historyArr = null
                }

                data.push(createTableEntry({
                    task:
                        (
                            <TaskName
                                // value={card.name + '/' + card._id + '/' + list._id}
                                card={card} listId={list._id}
                                project={props.project} />
                        ),
                    progress:
                        (
                            <TaskProgress
                                value={card.progress + '/' + card._id + '/' + list._id}
                                listId={list._id}
                                project={props.project} card={card} />
                        ),
                    assigned:
                        (
                            // <TaskMembers value={card.members} card={card} cardId={card._id} listId={list._id} project={props.project} size={30} title='+' />
                            <MembersList
                                members={card.members}
                                maxLength={3}
                                maxDisplayLength={3}                                
                            />
                        ),
                    monday: historyArr + '/' + thisCardDate + "/" + card.progress,
                    tuesday: historyArr + '/' + thisCardDate + "/" + card.progress,
                    wednesday: historyArr + '/' + thisCardDate + "/" + card.progress,
                    thursday: historyArr + '/' + thisCardDate + "/" + card.progress,
                    friday: historyArr + '/' + thisCardDate + "/" + card.progress,
                    saturday: historyArr + '/' + thisCardDate + "/" + card.progress,
                    sunday: historyArr + '/' + thisCardDate + "/" + card.progress,
                    dueDate: (
                        <div>
                            <span>
                                <TaskDueDate
                                    value={(thisCardDate !== '' && thisCardDate !== 0) ? ('0' + cardDate.getDate()).slice(-2) + '-' + ('0' + (cardDate.getMonth() + 1)).slice(-2) + '-' + cardDate.getFullYear() : ''}
                                    cardDueDate={cardDate}
                                    cardId={card._id}
                                    listId={list._id}
                                    props={props}
                                    project={props.project}
                                    card={card}
                                    teamId={params.teamid}
                                />
                            </span>
                        </div>
                    )
                }))
            })
            return data
        })

        data.push(createTableEntry({
            task: (
                <AddList props={props} project={props.project} />
            )
        }))

        setTableData(data)
    }

    useEffect(() => {
        updateTableData()
    }, [props.filter, props.project])

    const changeStartDate = (dayDiff) => {
        const newStartDate = new Date(startDate)
        newStartDate.setDate(newStartDate.getDate() + dayDiff)
        updateTableData()
        setStartDate(newStartDate)
    }

    function getMonday (date) {
        date = date || new Date()
    
        // need to change to 7 in case date is Sunday (which in JS is 0, while Monday is 1)
        const dateDay = date.getDay() || 7
        const monday = new Date(date)
        monday.setDate(date.getDate() - (dateDay - 1))
    
        return monday
    }

    return (
        <div className={styles.pageContainer}>
            {
                currList ?
                    < div >
                        <Transparent hideForm={() => setCurrList('')} >
                            <EditList hideForm={() => setCurrList('')} list={currList} project={props.project} />
                        </Transparent >
                    </div > : null
            }
            <div className={styles.buttoDiv}>
                <span>
                    <DatePicker
                        selected={startDate}
                        customInput={
                            <div className={styles.navigateButtons}>
                                Choose Week
                                </div>
                        }
                        // className={styles.reactDatepicker}
                        showWeekNumbers
                        onChange={date => setStartDate(getMonday(date))} />
                </span>
                <span className={styles.daysButtons}>

                    <button className={styles.navigateButtons} onClick={() => changeStartDate(-7)}>
                        Previous week
                    </button>
                    
                    <div className={styles.picContainer} onClick={() => changeStartDate(-1)}>
                        <img 
                            className={styles.buttonPreviousDay} 
                            src={previous} alt="..." width="126" height="27"
                        />
                        <div className={styles.centeredText}>Previous day</div>
                    </div>

                    <div className={styles.picContainer} onClick={() => changeStartDate(1)}>
                        <img 
                            className={styles.buttonPreviousDay} 
                            src={next} alt="..." width="126"
                            height="27" 
                        />
                        <div className={styles.centeredText}>Next day</div>
                    </div>

                    <button 
                        className={styles.navigateButtons}
                        onClick={() => changeStartDate(7)}
                    >
                        Next week
                    </button>
                </span>
                
            </div>
            <div>
                {/* <DragDropContext onDragEnd={handleDragEnd} > */}
                <ReactTable
                    // TrComponent={DragTrComponent}
                    // TbodyComponent={DropTbodyComponent}
                    // getTrProps={getTrProps}
                    data={tableData}
                    columns={
                        ColumnData(startDate)
                    }
                    defaultPageSize={10}
                    pageSize={tableData.length}
                    showPagination={false}
                    background={
                        'white'
                    }
                    style={{
                        'background': '#DFE9EE',
                        'borderRadius': '10px',
                        'border': '1px solid #707070',
                        'width': 'auto',
                        'display': 'flex',
                        'height': '70vh'                        
                    }}
                />

                {/* </DragDropContext> */}
            </div>
        </div>
    )

}

export default TableDndApp



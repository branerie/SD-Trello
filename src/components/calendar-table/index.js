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

const TableDndApp = (props) => {
    const [startDay, setStartDay] = useState(getMonday)
    const [tableData, setTableData] = useState([])
    const [isVisibleEditList, setIsVisibleEditList] = useState(false)
    const [currList, setCurrList] = useState('')
    const projectContext = useContext(ProjectContext)
    const userContext = useContext(UserContext)
    const params = useParams()

    const onListClick = useCallback(async (list) => {
        const memberArr = []
        await projectContext.project.membersRoles.map(element => {
            return memberArr.push({ admin: element.admin, username: element.memberId.username, id: element.memberId._id })

        })
        projectContext.setLists(projectContext.project.lists)
        const member = await memberArr.find(m => m.id === userContext.user.id)

        if (member && member.admin) {
            setCurrList(list)
            setIsVisibleEditList(!isVisibleEditList)
        }
    }, [isVisibleEditList, projectContext, userContext.user.id])


    const updateTableData = () => {
        const data = []
        const lists = props.project.lists
        projectContext.setLists(lists)

        lists.forEach((list, index) => {
            if (projectContext.hiddenLists.includes(list._id)) {
                return
            }

            data.push({
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
                progress: '',
                assigned: '',
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: '',
                saturday: '',
                sunday: '',
                dueDate: (
                    <div>
                        <AddTask listId={list._id} project={props.project} />
                    </div>
                )
            })



            let listCards = list.cards.filter(card => {
                if (!props.filter['Not Started'] && (card.progress === 0 || card.progress === null)) {
                    return false
                }
                if (!props.filter['In Progress'] && card.progress > 0 && card.progress < 100) {
                    return false
                }
                if (!props.filter['Done'] && card.progress === 100) {
                    return false
                }
                return true
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

                        if (currElement.event.slice(0, 8) === taskHistory[i + 1].event.slice(0, 8) && currElement.date === taskHistory[i + 1].date) {

                        } else {
                            historyArr.push(`${currElement.date}*${currElement.event}`)
                        }
                    }
                } else {
                    historyArr = null
                }

                data.push({

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
                            <TaskMembers value={card.members} card={card} cardId={card._id} listId={list._id} project={props.project} size={30} title='+' />
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
                })
            })
            return data
        })

        data.push({
            task: (
                <AddList props={props} project={props.project} />
            ),            
            progress: '',
            assigned: '',
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: "",
            dueDate: ''
        })

        setTableData(data)
    }


    useEffect(() => {
        updateTableData()
    }, [])

    function getMonday(inputDate) {
        const date = inputDate 
                        ? new Date(inputDate)
                        : new Date()

        const day = date.getDay()
        const diff = date.getDate() - day + (day === 0 ? -6 : 1)

        const lastMonday = new Date(date.setDate(diff))
        const monday = new Date(
                            lastMonday.getFullYear(), 
                            lastMonday.getMonth(), 
                            lastMonday.getDate())

        return monday
    }

    const getNextWeek = () => {
        var nextDay = startDay
        nextDay.setDate(nextDay.getDate() + 7)
        updateTableData()
        setStartDay(nextDay)
    }

    const getLastWeek = () => {
        var nextDay = startDay
        nextDay.setDate(nextDay.getDate() - 7)
        updateTableData()
        setStartDay(nextDay)
        updateTableData()
    }

    const getNextDay = () => {
        var nextDay = startDay
        nextDay.setDate(nextDay.getDate() + 1)
        updateTableData()
        setStartDay(nextDay)
    }

    const getLastDay = () => {
        var nextDay = startDay
        nextDay.setDate(nextDay.getDate() - 1)
        updateTableData()
        setStartDay(nextDay)
        updateTableData()
    }



    return (


        <div className={styles.pageContainer}>
            {
                isVisibleEditList ?
                    < div >
                        <Transparent hideForm={() => setIsVisibleEditList(!isVisibleEditList)} >
                            <EditList hideForm={() => setIsVisibleEditList(!isVisibleEditList)} list={currList} project={props.project} />
                        </Transparent >
                    </div > : null
            }
            <div className={styles.buttoDiv}>
                <span>
                    <DatePicker
                        selected={startDay}
                        customInput={
                            <div className={styles.navigateButtons}>
                                Choose Week
                                </div>
                        }
                        // className={styles.reactDatepicker}
                        showWeekNumbers
                        onChange={date => setStartDay(getMonday(date))} />
                </span>
                <span className={styles.daysButtons}>

                    <button className={styles.navigateButtons} onClick={getLastWeek} >Previous week</button>
                    
                    <div className={styles.picContainer} onClick={getLastDay}>
                        <img className={styles.buttonPreviousDay} src={previous} alt="..." width="126" height="27" />
                        <div className={styles.centeredText}>Previous day</div>
                    </div>

                    <div className={styles.picContainer} onClick={getNextDay}>
                        <img className={styles.buttonPreviousDay} src={next} alt="..." width="126" height="27" />
                        <div className={styles.centeredText}>Next day</div>
                    </div>

                    <button className={styles.navigateButtons} onClick={getNextWeek}>Next week</button>
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
                        ColumnData(startDay)
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



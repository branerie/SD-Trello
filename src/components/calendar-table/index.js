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
import ColumnData from "../calendar-data/column-data";
import Transparent from "../transparent";
import EditList from "../edit-list";





const TableDndApp = (props) => {
    const [startDay, setStartDay] = useState(getMonday)
    const [tableData, setTableData] = useState([])
    const [tableSize, setTableSize] = useState(10)
    const [isVisibleEditList, setIsVisibleEditList] = useState(false)
    const [currList, setCurrList] = useState('')




    const projectContext = useContext(ProjectContext)





    function getMonday(date) {
        let d
        if (date) {
            d = new Date(date)
        } else {
            d = new Date()
        }
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1)
        let thisMonday = new Date(d.setDate(diff))
        let monday = new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate())

        return monday
    }

    const cardData = useCallback(async () => {
        let numberOfRows = 0

        let data = []
        const lists = props.project.lists

        projectContext.setLists(lists)

        projectContext.lists
            .filter(element => !(projectContext.hiddenLists.includes(element._id)))
            .map((list, index) => {
                numberOfRows++
                data.push({
                    task: (
                        <div key={index} className={styles.listNameContainer} style={{ background: list.color || '#A6A48E' }}
                            onClick={() => { { setCurrList(list); setIsVisibleEditList(!isVisibleEditList) } }}
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

                    numberOfRows++

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
                                <TaskName value={card.name + '/' + card._id + '/' + list._id} props={props} project={props.project} />
                            ),
                        progress:
                            (
                                <TaskProgress value={card.progress + '/' + card._id + '/' + list._id} project={props.project} card={card} />
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
                                    <TaskDueDate value={(thisCardDate !== '' && thisCardDate !== 0) ? ('0' + cardDate.getDate()).slice(-2) + '-' + ('0' + (cardDate.getMonth() + 1)).slice(-2) + '-' + cardDate.getFullYear() : ''} cardDueDate={cardDate} cardId={card._id} listId={list._id} props={props} project={props.project} card={card} />
                                </span>
                            </div>
                        )
                    })

                })

                return data
            })

        numberOfRows++
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

        setTableSize(numberOfRows)


        setTableData(data)
        return numberOfRows


    }, [projectContext, props])


    useEffect(() => {
        cardData()
    }, [cardData])



    // const DragTrComponent = (props) => {

    //     const {children = null, rowInfo} = props;
    //     if (rowInfo) {
    //         // debugger;
    //         const {original, index} = rowInfo;
    //         const {firstName} = original;
    //         return (
    //             <Draggable key={firstName} index={index} draggableId={firstName}>
    //                 {(draggableProvided, draggableSnapshot) => (
    //                     <div
    //                         ref={draggableProvided.innerRef}
    //                         {...draggableProvided.draggableProps}
    //                         {...draggableProvided.dragHandleProps}
    //                     >
    //                         <ReactTable.defaultProps.TrComponent>
    //                             {children}
    //                         </ReactTable.defaultProps.TrComponent>
    //                     </div>
    //                 )}
    //             </Draggable>
    //         )
    //     } else
    //         return (
    //             <ReactTable.defaultProps.TrComponent>
    //                 {children}
    //             </ReactTable.defaultProps.TrComponent>
    //         )

    // }

    // const DropTbodyComponent = (props) => {

    //     const { children = null } = props

    //     return (
    //         <Droppable droppableId="droppable">
    //             {(droppableProvided, droppableSnapshot) => (
    //                 <div ref={droppableProvided.innerRef}>
    //                     <ReactTable.defaultProps.TbodyComponent>
    //                         {children}
    //                     </ReactTable.defaultProps.TbodyComponent>
    //                 </div>
    //             )}
    //         </Droppable>
    //     )

    // }


    // const handleDragEnd = result => {
    //     if (!result.destination) {
    //         return
    //     }

    //     const newData = reorder(
    //         tableData,
    //         result.source.index,
    //         result.destination.index
    //     );

    //     // tableData = newData

    // };


    // const getTrProps = (props, rowInfo) => {

    //     return { rowInfo }
    // };

    // const reorder = (list, startIndex, endIndex) => {
    //     const result = Array.from(list);
    //     const [removed] = result.splice(startIndex, 1);
    //     result.splice(endIndex, 0, removed);

    //     return result;
    // }   


    const getNextWeek = async () => {
        var nextDay = startDay
        await nextDay.setDate(nextDay.getDate() + 7)
        await cardData()
        setStartDay(nextDay)
    }

    const getLastWeek = async () => {

        var nextDay = startDay
        nextDay.setDate(nextDay.getDate() - 7)
        await cardData()
        setStartDay(nextDay)
        await cardData()

    }

    // const getNextDay = async () => {
    //     var nextDay = startDay
    //     await nextDay.setDate(nextDay.getDate() + 1)
    //     await cardData()
    //     setStartDay(nextDay)
    // }

    // const getLastDay = async () => {
    //     var nextDay = startDay
    //     nextDay.setDate(nextDay.getDate() - 1)
    //     await cardData()
    //     setStartDay(nextDay)
    //     await cardData()
    // }



    return (


        <div className={styles.reactTable}>
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
                <span>
                    <button className={styles.navigateButtons} onClick={getLastWeek} >Previous week</button>
                    <button className={styles.navigateButtons} onClick={getNextWeek}>Next week</button>
                </span>
                {/* <span>
                    <button className={styles.navigateButtons} onClick={getLastDay} >Previous Day</button>
                    <button className={styles.navigateButtons} onClick={getNextDay}>Next Day</button>
                </span> */}
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
                    pageSize={tableSize}
                    showPagination={false}
                    background={
                        'white'
                    }
                    style={{
                        'borderRadius': '10px',
                        'border': '1px solid #707070',
                        'width': 'auto',
                        'display': 'flex'
                    }}
                />

                {/* </DragDropContext> */}
            </div>
        </div>
    )

}

export default TableDndApp



import React, { useCallback, useEffect, useState, useContext } from "react";
import styles from './index.module.css'
import ReactTable from "react-table"
import "react-table/react-table.css"
import DatePicker from "react-datepicker"
import TaskName from '../calendar-data/task-name'
import TaskProgress from "../calendar-data/task-progress"
import TaskDueDate from "../calendar-data/task-dueDate"
import AddList from "../calendar-data/add-list"
import AddTask from "../calendar-data/add-task"
import TaskMembers from "../calendar-data/task-members"
import ProjectContext from "../../contexts/ProjectContext"
import ListColor from "../list-color"
import ColumnData from "../calendar-data/column-data";




const TableDndApp = (props) => {
    const [startDay, setStartDay] = useState(getMonday)
    const [tableData, setTableData] = useState([])
    const [tableSize, setTableSize] = useState(10)
    const projectContext = useContext(ProjectContext)


    function getMonday() {
        let d = new Date()
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
            .map((list) => {
                numberOfRows++
                data.push({
                    task: (
                        <div className={styles.listNameContainer} style={{ background: list.color || '#A6A48E' }} >
                            <span className={styles.listNameColor}>
                                {/* <ListColor color={list.color || '#A6A48E'} /> */}
                            </span>
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
                        <AddTask listId={list._id} project={props.project} />
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
                        monday: thisCardDate + "/" + card.progress,
                        tuesday: thisCardDate + "/" + card.progress,
                        wednesday: thisCardDate + "/" + card.progress,
                        thursday: thisCardDate + "/" + card.progress,
                        friday: thisCardDate + "/" + card.progress,
                        saturday: thisCardDate + "/" + card.progress,
                        sunday: thisCardDate + "/" + card.progress,
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



    return (
        <div className={styles.reactTable}>
            <div className={styles.buttoDiv}>
                <span>
                    <DatePicker
                        selected={startDay}
                        customInput={
                            <div className={styles.navigateButtons}>
                                Choose Week
                                </div>
                        }
                        showWeekNumbers
                        onChange={date => setStartDay(date)} />
                </span>
                <span>
                    <button className={styles.navigateButtons} onClick={getLastWeek} >Previous week</button>
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
                    pageSize={tableSize}
                    showPagination={false}
                    background={
                        'white'
                    }
                    style={{
                        'borderRadius': '10px',
                        'border': '1px solid #707070',
                        'width':'auto'
                    }}
                />

                {/* </DragDropContext> */}
            </div>
        </div>
    )

}

export default TableDndApp



// import React, { useState } from "react";
// // import { makeData, Logo, Tips } from "../calendar-data";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
// import ReactDatePicker from "react-datepicker"
// import ReactTable from "react-table"
// import "react-table/react-table.css"
// import styles from "./index.module.css"

// const TableDndApp = async () => {

//     var today = new Date()
//     const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
//     var weekDay = today.getDay()


//     // const [calendarDate, setCalendarDate] = useState(today)
//     const monthName = today.toLocaleString('default', { month: 'long' });
//     const year = today.getFullYear()
//     const month = today.getMonth()


//     var newdate = new Date(Date.UTC(year, month, 1))
//     var daysOfMonth = [];
//     while (newdate.getUTCMonth() === month) {
//         daysOfMonth.push(new Date(newdate));
//         newdate.setUTCDate(newdate.getUTCDate() + 1)
//     }





//     // let tableData = [{
//     //     monday: '1',
//     //     tuesday: '1',
//     //     wednesday: '1',
//     //     thursday: '1',
//     //     friday: '1',
//     //     saturday: '1',
//     //     sunday: '1'
//     // },{
//     //     monday: '1',
//     //     tuesday: '1',
//     //     wednesday: '1',
//     //     thursday: '1',
//     //     friday: '1',
//     //     saturday: '1',
//     //     sunday: '1'
//     // }]
//     // let weekObj = {}

//     // for (let i = 0; i < monthDays; i++) {
//     //     let dataArray = []
//     //     let weekObj = {
//     //         monday: '',
//     //         tuesday: '',
//     //         wednesday: '',
//     //         thursday: '',
//     //         friday: '',
//     //         saturday: '',
//     //         sunday: ''
//     //     }
//     //     let currentWeekDay = i.getDay()
//     //     let currentDay = i.getDate()
//     //     switch (currentWeekDay) {
//     //         case 0:
//     //             weekObj.sunday = currentDay;
//     //             break;
//     //         case 1:
//     //             weekObj.monday = currentDay;
//     //             break;
//     //         case 2:
//     //             weekObj.tuesday = currentDay;
//     //             break;
//     //         case 3:
//     //             weekObj.wednesday = currentDay;
//     //             break;
//     //         case 4:
//     //             weekObj.thursday = currentDay;
//     //             break;
//     //         case 5:
//     //             weekObj.friday = currentDay;
//     //             break;
//     //         case 6:
//     //             weekObj.saturday = currentDay;
//     //             break;
//     //     }
//     //     if (currentWeekDay = 0) {
//     //         dataArray.push(weekObj)
//     //     }
//     //     console.log(dataArray);
//     //     // tableData = dataArray
//     // }



//     // const [data, setData] = useState('makeData()')
//     // const newPerson = {
//     //     firstName: 'Pesho',
//     //     lastName: 'Peshev',
//     //     age: Math.floor(Math.random() * 30),
//     //     visits: Math.floor(Math.random() * 100),
//     //     progress: Math.floor(Math.random() * 100)
//     // }
//     // const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


//     //     const data = await function() {
//     //     return range.map(d => {
//     //         return {
//     //             ...newPerson(),
//     //             children: range(10).map(newPerson)
//     //         };
//     //     });
//     // }
//     const tableData = [
//         {
//             monday: 'dsfdfs',
//             tuesday: 'dsfasdf',
//             wednesday: 'month',
//             thursday: '87349585892118',
//             friday: '87349585892118',
//             saturday: '87349585892118',
//             sunday: '87349585892118'
//         },
//         {
//             monday: 'Kim Parrish',
//             tuesday: '4420 Valley Street, Garnerville, NY 10923',
//             wednesday: '07/11/2020',
//             thursday: '87349585892118',
//             friday: '87349585892118',
//             saturday: '87349585892118',
//             sunday: '87349585892118'
//         },
//         {
//             monday: 'Kim Parrish',
//             tuesday: '4420 Valley Street, Garnerville, NY 10923',
//             wednesday: '07/11/2020',
//             thursday: '87349585892118',
//             friday: '87349585892118',
//             saturday: '87349585892118',
//             sunday: '87349585892118'
//         },
//         {
//             monday: 'Kim Parrish',
//             tuesday: '4420 Valley Street, Garnerville, NY 10923',
//             wednesday: '07/11/2020',
//             thursday: '87349585892118',
//             friday: '87349585892118',
//             saturday: '87349585892118',
//             sunday: '87349585892118'
//         },
//         {
//             monday: 'Kim Parrish',
//             tuesday: '4420 Valley Street, Garnerville, NY 10923',
//             wednesday: '07/11/2020',
//             thursday: '87349585892118',
//             friday: '87349585892118',
//             saturday: '87349585892118',
//             sunday: '87349585892118'
//         },
//         {
//             monday: 'Kim Parrish',
//             tuesday: '4420 Valley Street, Garnerville, NY 10923',
//             wednesday: '07/11/2020',
//             thursday: '87349585892118',
//             friday: '87349585892118',
//             saturday: '87349585892118',
//             sunday: '87349585892118'
//         }
//     ]

//     const DragTrComponent = (props) => {

//         const { children = null, rowInfo } = props;
//         if (rowInfo) {
//             // debugger;
//             const { original, index } = rowInfo;
//             const { monday } = original;
//             return (
//                 <Draggable key={monday} index={index} draggableId={monday}>
//                     {(draggableProvided, draggableSnapshot) => (
//                         <div
//                             ref={draggableProvided.innerRef}
//                             {...draggableProvided.draggableProps}
//                             {...draggableProvided.dragHandleProps}
//                         >
//                             <ReactTable.defaultProps.TrComponent>
//                                 {children}
//                             </ReactTable.defaultProps.TrComponent>
//                         </div>
//                     )}
//                 </Draggable>
//             )
//         } else
//             return (
//                 <ReactTable.defaultProps.TrComponent>
//                     {children}
//                 </ReactTable.defaultProps.TrComponent>
//             )

//     }

//     const DropTbodyComponent = (props) => {

//         const { children = null } = props

//         return (
//             <Droppable droppableId="droppable">
//                 {(droppableProvided, droppableSnapshot) => (
//                     <div ref={droppableProvided.innerRef}>
//                         <ReactTable.defaultProps.TbodyComponent className={styles.columns}>
//                             {children}
//                         </ReactTable.defaultProps.TbodyComponent>
//                     </div>
//                 )}
//             </Droppable>
//         )

//     }

//     const handleDragEnd = result => {
//         if (!result.destination) {
//             return
//         }

//         const newData = reorder(
//             tableData,
//             result.source.index,
//             result.destination.index
//         );

//         tableData = newData

//     };

//     const getTrProps = (props, rowInfo) => {
//         //  console.log(rowInfo);
//         return { rowInfo };
//     };

//     const reorder = (list, startIndex, endIndex) => {
//         const result = Array.from(list);
//         const [removed] = result.splice(startIndex, 1);
//         result.splice(endIndex, 0, removed);

//         return result;
//     }



//     return (
//         <div>
//             <div>{monthName} - {year}</div>
//             <ReactDatePicker placeholderText={`Select month`} />
//             <DragDropContext onDragEnd={handleDragEnd}>
//                 <ReactTable
//                     TrComponent={DragTrComponent}
//                     TbodyComponent={DropTbodyComponent}
//                     getTrProps={getTrProps}
//                     data={tableData}
//                     columns={[
//                         {
//                             Header: "Monday",
//                             accessor: "monday"
//                         },
//                         {
//                             Header: "Tuesday",
//                             accessor: "tuesday"
//                         },
//                         {
//                             Header: "Wednesday",
//                             accessor: "wednesday"
//                         },
//                         {
//                             Header: "Thursday",
//                             accessor: "thursday"
//                         },
//                         {
//                             Header: "Friday",
//                             accessor: "friday"
//                         },
//                         {
//                             Header: "Saturday",
//                             accessor: "saturday"
//                         },
//                         {
//                             Header: "Sunday",
//                             accessor: "sunday"
//                         }
//                     ]}
//                     defaultPageSize={5}
//                     className="-striped -highlight"
//                 />
//             </DragDropContext>
//         </div>
//     )

// }

// export default TableDndApp


import React, { cloneElement, useCallback, useEffect, useState } from "react";
// import { makeData, Logo, Tips } from "../calendar-data";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import styles from './index.module.css'


// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const TableDndApp = (props) => {


    var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
    const [startDay, setStartDay] = useState(today)
    const [e, setE] = useState(0)
    const [tableData, setTableData] = useState([])
    const [pageSize, setPageSize] = useState(5)


    // const [calendarDate, setCalendarDate] = useState(today)
    const monthName = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear()
    const month = today.getMonth()

    const shownDay = (e) => {

        return (startDay.getDate() + e) + ' ' + (startDay.toLocaleString('default', { month: 'short' }))
    }

    const weekDay = (e) => {

        const weekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        let num = startDay.getDay() + e
        if (num > 6) {
            num = num - 7
        }
        var weekDay = weekArray[num]
        return weekDay
    }



    // var newdate = new Date(Date.UTC(year, month, 1))
    // var daysOfMonth = [];
    // while (newdate.getUTCMonth() === month) {
    //     daysOfMonth.push(new Date(newdate));
    //     newdate.setUTCDate(newdate.getUTCDate() + 1)
    // }
    let cardArray = []
    const lists = props.project.lists
    lists.map((e) => {
        let newCard = e.cards
        cardArray.push(newCard)
    })



    const cardData = useCallback(async () => {
        let data = [
            {
                task: '',
                progress: '',
                assigned: '',
                monday: shownDay(e),
                tuesday: shownDay(e + 1),
                wednesday: shownDay(e + 2),
                thursday: shownDay(e + 3),
                friday: shownDay(e + 4),
                saturday: shownDay(e + 5),
                sunday: shownDay(e + 6),
                dueDate: ''
            }
        ]
        cardArray.forEach(element => {
            setPageSize(pageSize + element.length)

            element.map((e) => {
                let cardDate = new Date(e.dueDate)
                console.log(cardDate.getTime());
                data.push({
                    task: e.name,
                    progress: e.progress,
                    assigned: e.members.map((member) => {
                        let members = ''
                        members = members + member.username + ' '
                        return members
                    }),
                    monday: cardDate.getTime(),
                    tuesday: cardDate.getTime(),
                    wednesday: cardDate.getTime(),
                    thursday: cardDate.getTime(),
                    friday: cardDate.getTime(),
                    saturday: cardDate.getTime(),
                    sunday: cardDate.getTime(),
                    dueDate: cardDate.getDate() + '-' + (cardDate.toLocaleString('default', { month: 'short' })) + '-' + cardDate.getFullYear()

                })
            })
        })


        setTableData(data)
    }, [])
    useEffect(() => {
        cardData()
    }, [cardData])



    const DragTrComponent = (props) => {

        const { children = null, rowInfo } = props;
        if (rowInfo) {
            // debugger;
            const { original, index } = rowInfo;
            const { firstName } = original;
            return (
                <Draggable key={firstName} index={index} draggableId={firstName}>
                    {(draggableProvided, draggableSnapshot) => (
                        <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                        >
                            <ReactTable.defaultProps.TrComponent>
                                {children}
                            </ReactTable.defaultProps.TrComponent>
                        </div>
                    )}
                </Draggable>
            )
        } else
            return (
                <ReactTable.defaultProps.TrComponent>
                    {children}
                </ReactTable.defaultProps.TrComponent>
            )

    }

    const DropTbodyComponent = (props) => {

        const { children = null } = props

        return (
            <Droppable droppableId="droppable">
                {(droppableProvided, droppableSnapshot) => (
                    <div ref={droppableProvided.innerRef}>
                        <ReactTable.defaultProps.TbodyComponent>
                            {children}
                        </ReactTable.defaultProps.TbodyComponent>
                    </div>
                )}
            </Droppable>
        )

    }


    const handleDragEnd = result => {
        if (!result.destination) {
            return
        }

        const newData = reorder(
            tableData,
            result.source.index,
            result.destination.index
        );

        tableData = newData

    };



    const getTrProps = (props, rowInfo) => {


        // console.log(rowInfo);

        return { rowInfo }

    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }



    return (
        <div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <ReactTable
                    TrComponent={DragTrComponent}
                    TbodyComponent={DropTbodyComponent}
                    getTrProps={getTrProps}
                    data={tableData}
                    columns={[
                        {
                            Header: 'Task',
                            accessor: "task",
                            width: 250,
                            // className: styles.task
                        },
                        {
                            Header: 'Progress',
                            accessor: "progress",
                            width: 100,
                            Cell: ({ data, value }) => {
                                if (value) {
                                    let color = ''
                                    switch (true) {
                                        case (value < 20):
                                            color = 'red'
                                            break;
                                        case (value < 100):
                                            color = 'blue'
                                            break;
                                        case (value === 100):
                                            color = 'green';
                                            break;
                                    }
                                    return (
                                        <div style={{ background: color }} > { value} %</div>
                                    )

                                }
                                return value
                            }
                        },
                        {
                            Header: 'Assigned to',
                            accessor: "assigned",
                            width: 200
                        },
                        {
                            Header: weekDay(e),
                            accessor: "monday",
                            width: 100,
                            Cell: ({ value }) => {
                                if (!isNaN(value)) {
                                    let checked = startDay.setDate(new Date().getDate());

                                    let color = ''
                                    let message = ''
                                    switch (true) {
                                        case (value === checked):
                                            color = 'red';
                                            message = 'Due Date'
                                            break;
                                        case (value > checked):
                                            color = 'blue';
                                            message = 'In Progress'
                                            break;
                                        case (value < checked):
                                            color = 'red';
                                            message = 'Delayed'
                                            break;
                                    }
                                    return <div style={{ background: color }} >{message}</div>

                                } else {
                                    return value
                                }
                            }
                        },
                        {
                            Header: weekDay(e + 1),
                            accessor: "tuesday",
                            width: 100,
                            Cell: ({ value }) => {
                                if (!isNaN(value)) {
                                    let checked = startDay.setDate(new Date().getDate() + 1)
                                    let color = ''
                                    let message = ''
                                    switch (true) {
                                        case (value === checked):
                                            color = 'red';
                                            message = 'Due Date'
                                            break;
                                        case (value > checked):
                                            color = 'blue';
                                            message = 'In Progress'
                                            break;
                                    }
                                    return <div style={{ background: color }} >{message}</div>

                                } else {
                                    return value
                                }
                            }
                        },
                        {
                            Header: weekDay(e + 2),
                            accessor: "wednesday",
                            width: 100,
                            Cell: ({ value }) => {
                                if (!isNaN(value)) {
                                    let checked = startDay.setDate(new Date().getDate() + 2)
                                    let color = ''
                                    let message = ''
                                    switch (true) {
                                        case (value === checked):
                                            color = 'red';
                                            message = 'Due Date'
                                            break;
                                        case (value > checked):
                                            color = 'blue';
                                            message = 'In Progress'
                                            break;
                                    }
                                    return <div style={{ background: color }} >{message}</div>

                                } else {
                                    return value
                                }
                            }
                        },
                        {
                            Header: weekDay(e + 3),
                            accessor: "thursday",
                            width: 100,
                            Cell: ({ value }) => {
                                if (!isNaN(value)) {
                                    let checked = startDay.setDate(new Date().getDate() + 3)
                                    let color = ''
                                    let message = ''
                                    switch (true) {
                                        case (value === checked):
                                            color = 'red';
                                            message = 'Due Date'
                                            break;
                                        case (value > checked):
                                            color = 'blue';
                                            message = 'In Progress'
                                            break;
                                    }
                                    return <div style={{ background: color }} >{message}</div>

                                } else {
                                    return value
                                }
                            }
                        },
                        {
                            Header: weekDay(e + 4),
                            accessor: "friday",
                            width: 100,
                            Cell: ({ value }) => {
                                if (!isNaN(value)) {
                                    let checked = startDay.setDate(new Date().getDate() + 4)
                                    let color = ''
                                    let message = ''
                                    switch (true) {
                                        case (value === checked):
                                            color = 'red';
                                            message = 'Due Date'
                                            break;
                                        case (value > checked):
                                            color = 'blue';
                                            message = 'In Progress'
                                            break;
                                    }
                                    return <div style={{ background: color }} >{message}</div>

                                } else {
                                    return value
                                }
                            }
                        },
                        {
                            Header: weekDay(e + 5),
                            accessor: "saturday",
                            width: 100,
                            Cell: ({ value }) => {
                                if (!isNaN(value)) {
                                    let checked = startDay.setDate(new Date().getDate() + 5)
                                    let color = ''
                                    let message = ''
                                    switch (true) {
                                        case (value === checked):
                                            color = 'red';
                                            message = 'Due Date'
                                            break;
                                        case (value > checked):
                                            color = 'blue';
                                            message = 'In Progress'
                                            break;
                                    }
                                    return <div style={{ background: color }} >{message}</div>

                                } else {
                                    return value
                                }
                            }
                        },
                        {
                            Header: weekDay(e + 6),
                            accessor: "sunday",
                            width: 100,
                            Cell: ({ value }) => {
                                if (!isNaN(value)) {
                                    let checked = startDay.setDate(new Date().getDate() + 6)
                                    let color = ''
                                    let message = ''
                                    switch (true) {
                                        case (value === checked):
                                            color = 'red';
                                            message = 'Due Date'
                                            break;
                                        case (value > checked):
                                            color = 'blue';
                                            message = 'In Progress'
                                            break;
                                    }
                                    return <div style={{ background: color }} >{message}</div>

                                } else {
                                    return value
                                }
                            }
                        },
                        {
                            Header: 'Due Date',
                            accessor: "dueDate",
                            width: 200
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </DragDropContext>
        </div>
    )

}

export default TableDndApp



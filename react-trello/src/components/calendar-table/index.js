

import React, { cloneElement, useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import styles from './index.module.css'
import ReactTable from "react-table";
import "react-table/react-table.css";
import Button from "../button";
import DatePicker from "react-datepicker"
import Avatar from "react-avatar";
import pen from '../../images/pen.svg'



const TableDndApp = (props) => {


    var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    const [startDay, setStartDay] = useState(today)
    const [tableData, setTableData] = useState([])
    const [pageSize, setPageSize] = useState(5)




    const shownDay = (value) => {
        let date = ''
        date = (startDay.getDate() + value) + ' ' + (startDay.toLocaleString('default', { month: 'short' }))
        return date
    }

    const weekDay = (num) => {
        const weekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        if (num > 6) {
            num = num - 7
        }
        var weekDay = weekArray[num]
        return weekDay
    }



    const cardData = useCallback(async () => {

        let data = []
        const lists = props.project.lists
        lists.map((e) => {
            let newCard = e.cards
            data.push({
                task: e.name,
                progress: '',
                assigned: '',
                monday: "",
                tuesday: "",
                wednesday: "",
                thursday: "",
                friday: "",
                saturday: "",
                sunday: "",
                dueDate: ""
            })


            newCard.forEach(element => {
                setPageSize(pageSize + element.length)

                let e = element
                let cardDate = new Date(e.dueDate)

                console.log(e.members);
                data.push({
                    task: e.name,
                    progress: e.progress,
                    assigned:
                        (
                            <div>
                                {
                                    e.members.map((member, index) => {
                                        return (
                                            <span key={index}>
                                                <Avatar name={member.username} size={30} round={true} maxInitials={2} onMouseEnter={<div>{member.username}</div>} />
                                            </span>
                                        )
                                    })
                                }
                            </div >
                        ),
                    monday: cardDate.getTime(),
                    tuesday: cardDate.getTime(),
                    wednesday: cardDate.getTime(),
                    thursday: cardDate.getTime(),
                    friday: cardDate.getTime(),
                    saturday: cardDate.getTime(),
                    sunday: cardDate.getTime(),
                    dueDate: (
                        <div className={styles.buttoDiv}>
                            <span>
                                {cardDate.getDate() + '-' + (cardDate.toLocaleString('default', { month: 'short' })) + '-' + cardDate.getFullYear()}
                            </span>
                            <span>
                                {
                                    <button className={styles.button} onClick={
                                        <DatePicker selected={cardDate}  label="Go to date" />
                                    }>
                                        <img src={pen} alt="..." width="11.5" height="11.5" />
                                    </button>
                                }
                            </span>
                        </div>
                    )
                    // })
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

    const getHeaderDate = (num) => {
        let dayNumber = startDay.getDay() + num
        let dayOfWeek = weekDay(dayNumber)
        let day = shownDay(num)
        return (
            <div>
                <div>{dayOfWeek}</div>
                <div>{day}</div>
            </div>
        )
    }

    const cellData = (value, num) => {
        if (num === 0) {
            if (value && !isNaN(value)) {
                let checked = startDay.setDate(startDay.getDate());
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
        } else if (!isNaN(value)) {

            var checkedDate = new Date(startDay);
            let checked = checkedDate.setDate(checkedDate.getDate() + num);

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
            return <div style={{ background: color, color: color }} >{message}</div>

        } else {
            return value
        }
    }

    const getNextWeek = async () => {
        var nextDay = startDay
        await nextDay.setDate(nextDay.getDate() + 7)
        await cardData()
        setStartDay(nextDay)
    }

    const getNextDay = async () => {
        var nextDay = startDay
        await nextDay.setDate(nextDay.getDate() + 1)
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

    const getLastDay = async () => {

        var nextDay = startDay
        nextDay.setDate(nextDay.getDate() - 1)
        await cardData()
        setStartDay(nextDay)
        await cardData()

    }




    return (
        <div>
            <div className={styles.buttoDiv}>
                <Button onClick={getLastWeek} title='Last week' />
                <Button onClick={getLastDay} title='Previous day' />

                <DatePicker selected={startDay} onChange={date => setStartDay(date)} label="Go to date" />

                <Button onClick={getNextDay} title='Next day' />
                <Button onClick={getNextWeek} title='Next week' />

            </div>
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
                            Header: getHeaderDate(0),
                            accessor: "monday",
                            width: 100,
                            Cell: ({ value }) => {
                                return cellData(value, 0)
                            }
                        },
                        {
                            Header: getHeaderDate(1),
                            accessor: "tuesday",
                            width: 100,
                            Cell: ({ value }) => {
                                return cellData(value, 1)
                            }
                        },
                        {
                            Header: getHeaderDate(2),
                            accessor: "wednesday",
                            width: 100,
                            Cell: ({ value }) => {
                                return cellData(value, 2)
                            }
                        },
                        {
                            Header: getHeaderDate(3),
                            accessor: "thursday",
                            width: 100,
                            Cell: ({ value }) => {
                                return cellData(value, 3)
                            }
                        },
                        {
                            Header: getHeaderDate(4),
                            accessor: "friday",
                            width: 100,
                            Cell: ({ value }) => {
                                return cellData(value, 4)
                            }
                        },
                        {
                            Header: getHeaderDate(5),
                            accessor: "saturday",
                            width: 100,
                            Cell: ({ value }) => {
                                return cellData(value, 5)
                            }
                        },
                        {
                            Header: getHeaderDate(6),
                            accessor: "sunday",
                            width: 100,
                            Cell: ({ value }) => {
                                return cellData(value, 6)
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



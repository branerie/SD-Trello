import React from 'react'
import styles from './index.module.css'



const ColumnData = (startDay) => {
    

    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())



    const shownDay = (value) => {
        let date = ''       
        date = (('0' + value.getDate())).slice(-2) + '.' + ('0' + (value.getMonth() + 1)).slice(-2)
        return date
    }

    const weekDay = (value) => {
        let num = value.getDay()
        const weekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        if (num > 6) {
            num = num - 7
        }
        var weekDay = weekArray[num]
        return weekDay
    }


    const cellData = (value, num) => {

        if (num === 0) {
            if (value) {
                let token = value.split('/')
                let date = Number(token[0])
                let progress = Number(token[1])
                let checked = startDay.setDate(startDay.getDate());
               
                let color = ''
                let message = ''
                if (date) {
                    switch (true) {
                        case (date === checked):
                            color = '#EF2D2D';
                            message = 'Due Date'
                            break;
                        case ((progress === 100) || (date === 100)):
                            color = '#0E8D27';
                            message = 'Finished'
                            break;
                        case (date > checked):
                            color = '#5E9DDC';
                            message = 'In Progress'
                            break;
                        case (date < checked && (progress < 100 || !progress)):
                            color = '#EF2D2D';
                            message = 'Delayed'
                            break;
                        default:
                            break;
                    }
                    return (
                        <div className={styles.daylyProgress}>
                            <div style={{ background: color, width: "100%", textAlign: "center", padding: "5px", fontSize: "14px", border: '#363338 solid 1px', borderRadius: '5px' }} >
                                {message}</div>
                        </div>
                    )
                } else {
                    return ''
                }
            } else {
                return value
            }
        } else if (num !== 0) {
            if (value) {
                let token = value.split('/')
                let date = Number(token[0])
                let progress = Number(token[1])
                var checkedDate = new Date(startDay);
                let checked = checkedDate.setDate(checkedDate.getDate() + num);


                let color = ''
                let message = ''
                switch (true) {
                    case (date === checked):
                        color = '#EF2D2D';
                        message = 'Due Date'
                        break;
                    case (date > checked && progress !== 100):
                        color = '#5E9DDC';
                        message = 'In Progress'
                        break;
                    default:
                        return null
                }
                return (
                    <div className={styles.daylyProgress}>
                        <div style={{ background: color, color: color, width: "100%", textAlign: "center", padding: "5px", fontSize: "14px", border: '#363338 solid 1px', borderRadius: '5px' }} >
                            {message}</div>
                    </div>
                )
            } else {
                return value
            }
        } else {
            return value
        }

    }


    const getHeaderDate = (num) => {
        var currDay = new Date(startDay);
        currDay.setDate(currDay.getDate() + num)
        let dayOfWeek = weekDay(currDay)
        let day = shownDay(currDay)
        let color = ''

        let thisDay = new Date(today)
        let thisDate = thisDay.getTime()

        var checkedDate = new Date(startDay);
        let checked = checkedDate.setDate(checkedDate.getDate() + num);

        if (checked === thisDate) {
            color = "#CFE2EC"
        }

        return (
            <div style={{ background: color, color: 'black' }}>
                <div style={{ fontWeight: '600' }}>{dayOfWeek}</div>
                <div style={{ fontSize: '80%' }}>{day}</div>
            </div>
        )
    }



    return (
        [
            {
                Header: () => {
                    return <div className={styles.header}>Task</div>
                },
                accessor: "task",
                minWidth: 150
            },
            {
                Header: () => {
                    return <div className={styles.header}>Progress</div>
                },
                accessor: "progress",
                minWidth: 100
            },
            {
                Header: () => {
                    return <div className={styles.header}>Teammates</div>
                },
                accessor: "assigned",
                minWidth: 130                
            },
            {
                Header: getHeaderDate(0),
                accessor: "monday",
                minWidth: 80,                
                Cell: ({ value }) => {
                    return cellData(value, 0)
                }
            },
            {
                Header: getHeaderDate(1),
                accessor: "tuesday",
                minWidth: 80,               
                Cell: ({ value }) => {
                    return cellData(value, 1)
                }
            },
            {
                Header: getHeaderDate(2),
                accessor: "wednesday",
                minWidth: 80,               
                Cell: ({ value }) => {
                    return cellData(value, 2)
                }
            },
            {
                Header: getHeaderDate(3),
                accessor: "thursday",
                minWidth: 80,               
                Cell: ({ value }) => {
                    return cellData(value, 3)
                }
            },
            {
                Header: getHeaderDate(4),
                accessor: "friday",
                minWidth: 80,               
                Cell: ({ value }) => {
                    return cellData(value, 4)
                }
            },
            {
                Header: getHeaderDate(5),
                accessor: "saturday",
                minWidth: 80,              
                Cell: ({ value }) => {
                    return cellData(value, 5)
                }
            },
            {
                Header: getHeaderDate(6),
                accessor: "sunday",
                minWidth: 80,               
                Cell: ({ value }) => {
                    return cellData(value, 6)
                }
            },
            {
                Header: () => {
                    return <div className={styles.header}>Due Date</div>
                },
                accessor: "dueDate",
                minWidth: 130,               
            }
        ]
    )
}


export default ColumnData

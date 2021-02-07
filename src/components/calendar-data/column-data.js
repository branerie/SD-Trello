import React from 'react'
import styles from './index.module.css'
import { checkDateEquality, compareDates, getDateWithOffset, formatDate } from '../../utils/date'

const CELL_COLORS = {
    CREATED: '#0E8D27',
    DUE_DATE: '#EF2D2D',
    DELAYED: '#EF2D2D',
    FINISHED: '#0E8D27',
    PROGRESS: '#5E9DDC'
}

const assembleColumnData = (startDate) => {
    const currentDate = new Date()
    const endDate = getDateWithOffset(startDate, 6)

    const getWeekdayCellHtml = (message, color, messageColor = 'black') => {
        const progressStyle = { 
            background: color, 
            color: messageColor,
            width: '100%',
            padding: '5px', 
            fontSize: '14px',
            border: '1px solid #363338',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }

        return (
            <div className={styles.daylyProgress}>
                <div style={progressStyle}>
                    {message}
                </div>
            </div>
        )
    }

    const getWeekdayCellData = (dataString, numDaysOffset) => {
        if (!dataString) {
            return ''
        }

        const { date, history, progress } = JSON.parse(dataString)
        const cellDate = getDateWithOffset(startDate, numDaysOffset)
        const eventsInWeek = []
        let taskStartDate = null
        let finishedDate = null
        if (history) {
            if (history.length > 0) {
                taskStartDate = new Date(history[0].date)
            } 

            for (let event of history) {
                const eventDate = new Date(event.date)
                if (compareDates(eventDate, startDate) >= 0 && 
                    compareDates(eventDate, endDate) <= 0) {
                    eventsInWeek.push(event)
                }

                if (event.event === 'Progress 100%') {
                    finishedDate = eventDate
                }
            }
        }

        // gets last event that occurred on this date for this task (if any occurred)
        const eventInCell = history && eventsInWeek.reverse().find(event => {
            const eventDate = new Date(event.date)
            return checkDateEquality(eventDate, cellDate)
        })

        const dueDate = date ? new Date(date) : null
        const isAfterDueDate = dueDate && compareDates(cellDate, dueDate) > 0
        if (eventInCell) {
            const [eventType, eventValue] = eventInCell.event.split(' ')

            if (eventType === 'Created') {
                return getWeekdayCellHtml(eventType, CELL_COLORS.CREATED)
            } else {
                if (eventType === 'Progress' && eventValue && eventValue === '100%') {
                    return getWeekdayCellHtml('Finished', CELL_COLORS.FINISHED)
                }

                const cellBackgroundColor = isAfterDueDate 
                                            ? CELL_COLORS.DELAYED
                                            : CELL_COLORS.PROGRESS
                return getWeekdayCellHtml(eventInCell.event, cellBackgroundColor)
            }
        }

        // if we get to here, we know that there are no new events on the day of the cell
        const isMonday = numDaysOffset === 0
        if (isMonday && progress && progress === 100 && eventsInWeek.length === 0) {
            // progress for task is 100% and no new events happen during the week
            return getWeekdayCellHtml('Finished', CELL_COLORS.FINISHED)
        }

        if (dueDate) {
            if (checkDateEquality(cellDate, dueDate)) {
                if (compareDates(currentDate, dueDate) > 0) {
                    // cell date is the task due date and current date is later than that
                    return getWeekdayCellHtml('Delayed', CELL_COLORS.DELAYED)
                }

                return getWeekdayCellHtml('Due Date', CELL_COLORS.DUE_DATE)
            }

            if (compareDates(cellDate, dueDate) > 0) {
                if (isMonday && compareDates(currentDate, cellDate) > 0) {
                    return getWeekdayCellHtml('Delayed', CELL_COLORS.DELAYED)
                }

                return ''
            }

            if (finishedDate && compareDates(cellDate, finishedDate) > 0) {
                // task has finished in the past and cell date is later than date of finish
                return ''
            }

            if (isMonday && taskStartDate && compareDates(taskStartDate, startDate) > 0) {
                // task has started, but first displayed date is earlier than task start date
                return ''
            }

            
            // task is neither Finished, nor Delayed, but has a Due Date
            // therefore, it's In Progress
            const cellText = isMonday ? 'In Progress' : ''
            return getWeekdayCellHtml(cellText, CELL_COLORS.PROGRESS)
        }

        return ''
    }
        
    const getHeaderDateHtml = (numDaysOffset) => {
        const headerDate = getDateWithOffset(startDate, numDaysOffset)
        const color = checkDateEquality(currentDate, headerDate) ? "#CFE2EC" : ''

        const displayedDate = formatDate(headerDate, '%d.%m')
        const displayedDayOfWeek = formatDate(headerDate, '%W')

        return (
            <div style={{ backgroundColor: color, color: 'black' }}>
                <div style={{ fontWeight: '600' }}>{displayedDayOfWeek}</div>
                <div style={{ fontSize: '80%' }}>{displayedDate}</div>
            </div>
        )
    }

    const wrapCellData = (cellData) => {
        return (
            <div style={{ 
                whiteSpace: 'normal', 
                overflowWrap: 'anywhere', 
                textAlign: 'left',
                height: '100%'}}
            >
                {cellData}
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
                minWidth: 450,
                Cell: ({ value }) => wrapCellData(value),
                sortable: true,
            },
            {
                Header: () => {
                    return <div className={styles.header}>Progress</div>
                },
                accessor: "progress",
                minWidth: 70,
                Cell: ({ value }) => wrapCellData(value),
                sortable: true,
                sortMethod: () => {}
            },
            {
                Header: () => {
                    return <div className={styles.header}>Teammates</div>
                },
                accessor: "assigned",
                minWidth: 90,
                Cell: ({ value }) => wrapCellData(value),
                sortable: false
            },
            {
                Header: getHeaderDateHtml(0),
                accessor: "monday",
                minWidth: 100,
                Cell: ({ value }) => getWeekdayCellData(value, 0),
                sortable: false
            },
            {
                Header: getHeaderDateHtml(1),
                accessor: "tuesday",
                minWidth: 100,
                Cell: ({ value }) => getWeekdayCellData(value, 1),
                sortable: false
            },
            {
                Header: getHeaderDateHtml(2),
                accessor: "wednesday",
                minWidth: 100,
                Cell: ({ value }) => getWeekdayCellData(value, 2),
                sortable: false
            },
            {
                Header: getHeaderDateHtml(3),
                accessor: "thursday",
                minWidth: 100,
                Cell: ({ value }) => getWeekdayCellData(value, 3),
                sortable: false
            },
            {
                Header: getHeaderDateHtml(4),
                accessor: "friday",
                minWidth: 100,
                Cell: ({ value }) => getWeekdayCellData(value, 4),
                sortable: false
            },
            {
                Header: getHeaderDateHtml(5),
                accessor: "saturday",
                minWidth: 100,
                Cell: ({ value }) => getWeekdayCellData(value, 5),
                sortable: false
            },
            {
                Header: getHeaderDateHtml(6),
                accessor: "sunday",
                minWidth: 100,
                Cell: ({ value }) => getWeekdayCellData(value, 6),
                sortable: false
            },
            {
                Header: () => {
                    return <div className={styles.header}>Due Date</div>
                },
                accessor: "dueDate",
                minWidth: 110,
                sortable: true,
                sortMethod: () => {}
            }
        ]
    )
}


export default assembleColumnData

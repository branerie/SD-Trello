import { compareDates, formatDate } from '../../utils/date'

const sortByTask = (cardOne, cardTwo) => cardOne.name.localeCompare(cardTwo.name)

const sortByProgress = (cardOne, cardTwo) => {
    const firstValue = cardOne.progress || 0
    const secondValue = cardTwo.progress || 0

    if (firstValue > secondValue) {
        return 1
    } else if (firstValue < secondValue) {
        return -1
    }

    return 0
}

const sortByDueDate = (cardOne, cardTwo) => {
    const parsedDateOne = cardOne.dueDate ? new Date(cardOne.dueDate) : new Date('1970-01-01')
    const parsedDateTwo = cardTwo.dueDate ? new Date(cardTwo.dueDate) : new Date('1970-01-01')

    return compareDates(parsedDateOne, parsedDateTwo)
}

const getCardsSortMethod = (columnName, isDescending) => {
    let sortingFunc = null
    switch(columnName) {
        case 'task':
            sortingFunc = sortByTask
            break
        case 'progress':
            sortingFunc = sortByProgress
            break
        case 'dueDate':
            sortingFunc = sortByDueDate
            break
        default:
            return null
    }

    return (firstValue, secondValue) => {
        const sortingEvaluation = sortingFunc(firstValue, secondValue)
        return isDescending ? -sortingEvaluation : sortingEvaluation
    }
}

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

const parseCardHistory = (taskHistory) => {
    if (!taskHistory) {
        return null
    }

    const historyByDate = { events: {}, hasEventsInWeek: {} }
    for (let element of taskHistory) {
        const elementDate = new Date(element.date)

        if (element.event === 'Created') {
            historyByDate.startDate = elementDate
        }

        historyByDate.events[formatDate(elementDate, '%d/%m/%y')] = element
        historyByDate.hasEventsInWeek[formatDate(elementDate, '%w/%y')] = true
    }

    const lastHistoryEvent = taskHistory[taskHistory.length - 1]
    if (lastHistoryEvent && lastHistoryEvent.event === 'Progress 100%') {
        historyByDate.finishedDate = new Date(lastHistoryEvent.date)
    }
    
    return historyByDate

    // const historyArr = []
    // for (let histIndex = 0; histIndex < taskHistory.length; histIndex++) {
    //     const currElement = taskHistory[histIndex]
    //     const nextElement = taskHistory[histIndex + 1]
        
    //     const currEventType = currElement.event.split(' ')[0]
        
    //     let shouldIncludeEvent = true
    //     if (nextElement) {
    //         const nextEventType = nextElement.event.split(' ')[0]

    //         if (nextEventType === currEventType && 
    //             currElement.date === nextElement.date) {
    //             shouldIncludeEvent = false
    //         }
    //     }

    //     if (shouldIncludeEvent) {
    //         historyArr.push({
    //             event: currElement.event,
    //             date: currElement.date
    //         })
    //     }
    // }

    // return historyArr
}

const applyCardFilters = (card, filters) => {
    let isCardFilterPassed = false
    if (filters.progress.notStarted && 
        (card.progress === 0 || !card.progress)) {
        isCardFilterPassed = true
    }

    if (filters.progress.inProgress && card.progress > 0 && card.progress < 100) {
        isCardFilterPassed = true
    }
    
    if (filters.progress.done && card.progress === 100) {
        isCardFilterPassed = true
    }

    const isUserFilterPassed = filters.member 
                    ? card.members.some(m => m._id === filters.member.id) 
                    : true

    const isDueDateFilterPassed = filters.dueBefore
                    ? card.dueDate && compareDates(new Date(card.dueDate), filters.dueBefore) <= 0
                    : true

    return isCardFilterPassed && isUserFilterPassed && isDueDateFilterPassed
}

export {
    createTableEntry,
    parseCardHistory,
    applyCardFilters,
    getCardsSortMethod
}
import { compareDates } from "../../utils/date"

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
    
    const historyArr = []
    for (let histIndex = 0; histIndex < taskHistory.length; histIndex++) {
        const currElement = taskHistory[histIndex]
        const nextElement = taskHistory[histIndex + 1]
        
        const currEventType = currElement.event.split(' ')[0]
        
        let shouldIncludeEvent = true
        if (nextElement) {
            const nextEventType = nextElement.event.split(' ')[0]

            if (nextEventType === currEventType && 
                currElement.date === nextElement.date) {
                shouldIncludeEvent = false
            }
        }

        if (shouldIncludeEvent) {
            historyArr.push({
                event: currElement.event,
                date: currElement.date
            })
        }
    }

    return historyArr
}

const getMonday = (date) => {
    date = date || new Date()

    // need to change to 7 in case date is Sunday (which in JS is 0, while Monday is 1)
    const dateDay = date.getDay() || 7
    const monday = new Date(date)
    monday.setDate(date.getDate() - (dateDay - 1))

    return monday
}

const applyCardFilters = (card, filters) => {
    let isCardFilterPassed = false
    if (filters.bool.notStarted && 
        (card.progress === 0 || card.progress === null)) {
        isCardFilterPassed = true
    }

    if (filters.bool.inProgress && card.progress > 0 && card.progress < 100) {
        isCardFilterPassed = true
    }
    
    if (filters.bool.done && card.progress === 100) {
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
    getMonday,
    applyCardFilters
}
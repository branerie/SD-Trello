const FORMAT_REGEX = /%[aAbBdmwyY]/g

const MONTHS = [ 
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'
]

const WEEKDAYS = [ 
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const MILLISECONDS_IN_DAY = 86400000

const FORMAT_OPTIONS = {
    'y': (date) => date.getUTCFullYear().toString().slice(-2),      // short year (2018 => 18)
    'Y': (date) => date.getUTCFullYear(),                           // full year (2018 => 2018)
    'm': (date) => `0${date.getMonth() + 1}`.slice(-2),             // month as a number (01 - 12)
    'b': (date) => MONTHS[date.getMonth()].slice(0, 3),             // month, short (Dec, Apr etc.)
    'B': (date) => MONTHS[date.getMonth()],                         // month, long (December)
    'd': (date) => `0${date.getDate()}`.slice(-2),                  // day of month (01 - 31)
    'a': (date) => WEEKDAYS[date.getDay()].slice(0, 3),             // weekday, short (Mon, Wed)
    'A': (date) => WEEKDAYS[date.getDay()],                         // weekday, long (Monday)
    'w': (date) => getWeekNumber(date),                             // week number of the year (1-53)
}

const getDateWithOffset = (initialDate, daysOffset) => {
    return new Date(initialDate.getTime() + daysOffset * MILLISECONDS_IN_DAY)
}

const getMonday = (date) => {
    date = date || new Date()

    // need to change to 7 in case date is Sunday (which in JS is 0, while Monday is 1)
    const dateDay = date.getDay() || 7
    const monday = new Date(date)
    monday.setDate(date.getDate() - (dateDay - 1))

    return monday
}

const getWeekNumber = (date) => {
    // Thursday in current week decides the year
    // (each week's year is the Gregorian year in which the Thursday falls)
    const currWeekThursday = getDateWithOffset(getMonday(date), 3)

    // January 4th is always in week 1
    const week1 = new Date(date.getFullYear(), 0, 4)
    const week1Thursday = getDateWithOffset(getMonday(week1), 3)

    return 1 + Math.round((currWeekThursday.getTime() - week1Thursday.getTime()) / ( 7 * MILLISECONDS_IN_DAY))
}

/*  Receives a Javascript date as a first parameter and a format string 
as a second parameter and returns a string representing the date in 
the desired format. The format string has several options which can be
seen in the "FORMAT_OPTIONS" constant above. 
!!! Every format option must be preceded by a percentage sign (%)
Examples: 
    In: (date: new Date('2021-01-28'), formatString: '%y_%B_%d')
   Out: '21_January_28'

   In: (date: new Date('2020-05-12), formatString: '%a, %d %b, %Y')
  Out: 'Tue, 12 May, 2020'
 */
const formatDate = (date, formatString) => {
    return formatString.replace(FORMAT_REGEX, (substr) => {
        const formatType = substr[1]
        const result = FORMAT_OPTIONS[formatType](date)
        return result
    })
}

/* Returns true if the year, month and day of two dates are the same,
and false otherwise (i.e. ignores time)
*/
const checkDateEquality = (firstDate, secondDate) => {
    return firstDate.getYear() === secondDate.getYear() 
        && firstDate.getMonth() === secondDate.getMonth() 
        && firstDate.getDate() === secondDate.getDate()
}

/* Returns 1 if firstDate is larger, -1 if secondDate is larger
and 0 if the year, month and day of both dates are equal (ignores time)
*/
const compareDates = (firstDate, secondDate) => {
    const firstDateYear = firstDate.getYear()
    const secondDateYear = secondDate.getYear()

    if (firstDateYear !== secondDateYear) {
        return 1 - 2 * (secondDateYear > firstDateYear)
    }

    const firstDateMonth = firstDate.getMonth()
    const secondDateMonth = secondDate.getMonth() 
    
    if (firstDateMonth !== secondDateMonth) {
        return 1 - 2 * (secondDateMonth > firstDateMonth)
    }

    const firstDateDay = firstDate.getDate()
    const secondDateDay = secondDate.getDate()

    if (firstDateDay !== secondDateDay) {
        return 1 - 2 * (secondDateDay > firstDateDay)
    }

    return 0
}

export {
    formatDate,
    checkDateEquality,
    compareDates,
    getDateWithOffset,
    getMonday
}
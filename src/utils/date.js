const FORMAT_REGEX = /%[yYmbBdwW]/g

const MONTHS = [ 
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'
]

const WEEKDAYS = [ 
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const formatOptions = {
    'y': (date) => date.getUTCFullYear().toString().slice(-2),      // short year (2018 => 18)
    'Y': (date) => date.getUTCFullYear(),                           // full year (2018 => 2018)
    'm': (date) => `0${date.getMonth() + 1}`.slice(-2),             // month as a number (01 - 12)
    'b': (date) => MONTHS[date.getMonth()].slice(0, 3),             // month, short (Dec, Apr etc.)
    'B': (date) => MONTHS[date.getMonth()],                         // month, long (December)
    'd': (date) => `0${date.getDate()}`.slice(-2),                  // day of month (01 - 31)
    'w': (date) => WEEKDAYS[date.getDay()].slice(0, 3),             // weekday, short (Mon, Wed)
    'W': (date) => WEEKDAYS[date.getDay()],                         // weekday, long (Monday)=
}

/*  Receives a Javascript date as a first parameter and a format string 
as a second parameter and returns a string representing the date in 
the desired format. The format string has several options which can be
seen in the "formatOptions" constant above. 
!!! Every format option must be preceded by a percentage sign (%)
Examples: 
    In: (date: new Date('2021-01-28'), formatString: '%y_%B_%d')
   Out: '21_January_28'

   In: (date: new Date('2020-05-12), formatString: '%w, %d %b, %Y')
  Out: 'Tue, 12 May, 2020'
 */
const formatDate = (date, formatString) => {
    return formatString.replace(FORMAT_REGEX, (substr) => {
        const formatType = substr[1]
        const result = formatOptions[formatType](date)
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

const getDateWithOffset = (initialDate, daysOffset) => {
    const initialTime = initialDate.getTime()
    
    // initialTime(ms) * daysOffset * (milliseconds in a day)
    return new Date(initialTime + daysOffset * 86400000)
}

export {
    formatDate,
    checkDateEquality,
    compareDates,
    getDateWithOffset
}
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

const addTableEntry = (data, entry) => {
    data.push({
        progress: entry.progress || '',
        assigned: entry.assigned || '',
        monday: entry.monday || '',
        tuesday: entry.tuesday || '',
        wednesday: entry.wednesday || '',
        thursday: entry. thursday || '',
        friday: entry.friday || '',
        saturday: entry.saturday || '',
        sunday: entry.sunday || '',
        dueDate: entry.dueDate || ''
    })
}

const CalendarTable = ({ filter, project }) => {
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        const data = []
        const { lists } = project


    }, [filter, project])
}

export default CalendarTable
const getProgressBackgroundColor = (input) => {
    if (Number(input) <= 10) {
        return '#EF2D2D'
    }

    if (Number(input) <= 80) {
        return '#5E9DDC'
    }
    
    if (Number(input) > 80) {
        return '#0E8D27'
    }
}

export default getProgressBackgroundColor
// import React from 'react'
// import { useParams } from 'react-router-dom'
// import styles from './index.module.css'
// import ProgressInput from '../../Inputs/ProgressInput'

// const TaskProgress = ({ card, listId, project }) => {
//     const { teamid: teamId } = useParams()

    // const editCardProgress = useCallback(async (event) => {
    //     event.preventDefault()

    //     const cardId = card._id

    //     if (!cardProgress || (cardProgress > 100) || (cardProgress < 0)) {
    //         return
    //     }

    //     const cardProgressNum = Number(cardProgress)
    //     const newCardProgress = Math.max(Math.min(cardProgressNum, 100), 0)

    //     if (isNaN(cardProgressNum) || newCardProgress === Number(card.progress)) {
    //         return
    //     }

    //     setCardProgress(newCardProgress)

    //     const newTaskHistory = [...taskHistory, { event: `Progress ${cardProgress}%`, date: today }]
    //     setTaskHistory(newTaskHistory)

    //     const editedFields = {
    //         progress: cardProgress,
    //         history: newTaskHistory
    //     }
    //     await editTask(listId, cardId, editedFields)

    //     setIsActive(!isActive)
    //     socket.emit('project-update', project)
    //     socket.emit('task-team-update', teamId)

    // }, [editTask, cardProgress, isActive, setIsActive, taskHistory, today, card._id, listId, project, socket, teamId, card.progress])


    // function showTaskProgress(value) {

    //     if (value && value !== 'null') {
    //         return (
    //             <div style={{
                    // backgroundColor: getBackGroundColor(value),
                    // padding: '5px',
                    // border: 'solid black 1px',
                    // borderRadius: '5px',
                    // minHeight: '2rem',
                    // width: '100%',
                    // textAlign: 'center',
                    // display: 'flex',
                    // alignItems: 'center',
                    // justifyContent: 'center'
    //             }} > {value} %</div>
    //         )

    //     }
    //     return (
    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    //             + Add
    //         </div>
    //     )
    // }


    // function getBackGroundColor(value) {
    //     let currColor = ''
    //     switch (true) {
    //         case (value === 100 || value === '100'):
    //             currColor = '#0E8D27'
    //             break
    //         case (value < 20):
    //             currColor = '#EF2D2D'
    //             break
    //         case (value < 100):
    //             currColor = '#5E9DDC'
    //             break
    //         default:
    //             break
    //     }
    //     return currColor
    // }

//     return (
//         <ProgressInput
//             card={card}
//             listId={listId}
//             project={project}
//             teamId={teamId}
//             inputClassName={styles.input}
//             placeholderClassName={styles.placeholder}
//             isBackgroundStyled={true}
//         />
//     )
// }

// export default TaskProgress
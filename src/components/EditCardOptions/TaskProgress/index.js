import React, { useState, useEffect } from 'react'
import commonStyles from '../index.module.css'
import styles from './index.module.css'
import ProgressBar from '../../ProgressBar'
import EditCardProgressInput from '../../Inputs/EditCardProgressInput'
import progressPic from '../../../images/edit-card/progress.svg'

const TaskProgress = ({ card, listId, project, teamId, taskHistory, setTaskHistory }) => {
    const [isInputVisible, setIsInputVisible] = useState(false)
    const [isInputActive, setIsInputActive] = useState(false)

    useEffect(() => {
        setIsInputVisible(card.progress !== null)
    }, [card.progress])

    const onClick = () => {
        setIsInputVisible(true)
        setIsInputActive(true)
    }

    return (
        <>
            <div className={commonStyles['small-buttons']} onClick={onClick} >
                <img className={commonStyles.pics} src={progressPic} alt='' />
                Progress
            </div>
            {card.progress !== null &&
                <div className={styles['progress-bar']} >
                    <ProgressBar progress={card.progress} />
                </div>
            }
            {isInputVisible && <div className={styles['progress-input-container']}>
                <EditCardProgressInput
                    card={card}
                    listId={listId}
                    project={project}
                    teamId={teamId}
                    setIsInputVisible={setIsInputVisible}
                    taskHistory={taskHistory}
                    setTaskHistory={setTaskHistory}
                    inputClassName={styles['progress-input']}
                    placeholderClassName={styles.progress}
                    isInputActive={isInputActive}
                    setIsInputActive={setIsInputActive}
                />
            </div>}
        </>
    )
}

export default TaskProgress
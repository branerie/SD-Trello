import React, { useContext, useRef, useState, useEffect } from 'react'
import styles from './index.module.css'
import { useHistory, useParams } from 'react-router-dom'
import ButtonClean from '../ButtonClean'
import ProjectContext from '../../contexts/ProjectContext'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'

export default function ViewDropdown() {
    const history = useHistory()
    const params = useParams()
    const projectContext = useContext(ProjectContext)
    const viewRef = useRef(null)
    const [isViewActive, setIsViewActive] = useDetectOutsideClick(viewRef)
    const [viewState, setViewState] = useState(null)

    useEffect(() => {
        if (window.location.href.includes('board')) {
            setViewState('Board')
        }
        if (window.location.href.includes('list')) {
            setViewState('List')
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.title}>View:</div>
            <div className={styles['dropdown-container']}>
                <ButtonClean
                    className={styles.button}
                    onClick={() => setIsViewActive(!isViewActive)}
                    title={viewState}
                />
                {isViewActive && <div ref={viewRef} className={styles.dropdown} >
                    <ButtonClean
                        title='Board'
                        className={styles.options}
                        onClick={() => { history.push(`/project-board/${params.teamid}/${projectContext.project._id}`); setIsViewActive(false) }}
                    />
                    <ButtonClean
                        title='List'
                        className={`${styles.options} ${styles['last-option']}`}
                        onClick={() => { history.push(`/project-list/${params.teamid}/${projectContext.project._id}`); setIsViewActive(false) }}
                    />
                </div>}
            </div>

        </div>
    )
}

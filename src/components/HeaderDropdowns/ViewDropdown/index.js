import React, { useContext, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import ProjectContext from '../../../contexts/ProjectContext'
import commonStyles from '../index.module.css'
import ButtonClean from '../../ButtonClean'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'

const ViewDropdown = () => {
    const { project } = useContext(ProjectContext)
    const [isViewActive, setIsViewActive, viewRef] = useDetectOutsideClick()
    const [viewState, setViewState] = useState(null)
    const history = useHistory()
    const params = useParams()

    useEffect(() => {
        if (window.location.href.includes('board')) {
            setViewState('Board')
        }
        if (window.location.href.includes('list')) {
            setViewState('List')
        }
    }, [])

    const goToSelectedView = (view) => {
        history.push(`/project-${view}/${params.teamid}/${project._id}`)
        setIsViewActive(false)
    }

    return (
        <div className={commonStyles.container}>
            <div className={commonStyles.title}>View:</div>
            <div className={commonStyles['dropdown-container']}>
                <ButtonClean
                    className={commonStyles.button}
                    onClick={() => setIsViewActive(!isViewActive)}
                    title={viewState}
                />
                {isViewActive && <div ref={viewRef} className={commonStyles.dropdown} >
                    <ButtonClean
                        title='Board'
                        className={commonStyles.options}
                        onClick={() => goToSelectedView('board')}
                    />
                    <ButtonClean
                        title='List'
                        className={`${commonStyles.options} ${commonStyles['last-option']}`}
                        onClick={() => goToSelectedView('list')}
                    />
                </div>}
            </div>
        </div>
    )
}

export default ViewDropdown
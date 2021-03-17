import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TeamContext from '../../../contexts/TeamContext'
import ProjectContext from '../../../contexts/ProjectContext'
import commonStyles from '../index.module.css'
import LinkComponentTitle from '../../LinkTitle'
import ButtonClean from '../../ButtonClean'
import Transparent from '../../Transparent'
import CreateProject from '../../CreateProject'
import ButtonCleanTitle from '../../ButtonCleanTitle'
import { useDetectOutsideClick } from '../../../utils/useDetectOutsideClick'

const ProjectDropdown = () => {
    const { currentProjects } = useContext(TeamContext)
    const { project } = useContext(ProjectContext)
    const [isShownProjectForm, setIsShownProjectForm] = useState(false)
    const [isShownOldProjects, setIsShownOldProjects] = useState(false)
    const [isProjectActive, setIsProjectActive, projectRef] = useDetectOutsideClick()
    const params = useParams()

    useEffect(() => {
        /* REVIEW: тук може да се избегне ползването на else като се напише:
        if (project.isFinished === true) {
            return setIsShownOldProjects(true)
        }
        
        setIsShownOldProjects(false)
         */
        if (project.isFinished === true) {
            setIsShownOldProjects(true)
        } else {
            setIsShownOldProjects(false)
        }
    }, [project.isFinished])


    return (
        <div className={`${commonStyles.container} ${commonStyles['project-media']}`}>
            <div className={commonStyles.title}>Project:</div>
            <div className={commonStyles['dropdown-container']}>
                <ButtonCleanTitle
                    className={commonStyles.button}
                    onClick={() => setIsProjectActive(!isProjectActive)}
                    title={project.name}
                />
                {isProjectActive && <div ref={projectRef} className={commonStyles.dropdown} >
                    <div className={commonStyles['options-container']} >
                        {/* REVIEW: filter метода очаква callback-a (функцията дето му се подава) да връща булеви стойности.
                        Ако тя не върне булева стойност, filter ще си я обърне в такава. Тоест, ако върне 0, undefined или 
                        null, filter ще го счете като false. Ако върне каквото и да е друго, ще го счете за true. Демек няма 
                        нужда от сравнение със true/false/undefined както отдолу. Освен това е малко объркващо да се ползва 
                        ternary оператор, който връща arrow функции. Не е грешно, ама в повечето случаи в практиката ternary 
                        ще се използва вътре в самата arrow функция и ще се разбира по-лесно. Може да стане така:
                            currentProjects.filter(p => !isShownOldProjects ? !p.isFinished : p.isFinished)
                        От тук може да се опрости още повече. Първо - гледайте като ползвате булеви променливи при проверки 
                        да използвате true стойността (ако не се получава твърде кофти кода), защото се чете по-лесно. По-лесно 
                        е да осмислиш isShownOldProjects, от колкото !isShownOldProjects (второто трябва да го обърнеш в главата 
                        си). Тоест, в случая това се чете по-лесно:
                            currentProjects.filter(p => isShownOldProjects ? p.isFinished : !p.isFinished)
                        От тук може да се направи още едно опростение. Ако сме сигурни, че p.isFinished винаги е булева стойност
                        (няма как да е undefined например, а винаги ще е true/false), може да се напише така:
                            currentProjects.filter(p => p.isFinished === isShownOldProjects)
                        Ако не сме сигурни, че е true/false, този синтаксис: !!(p.isFinished) обръща каквато и да е стойност в 
                        булевия и еквивалент:
                            currentProjects.filter(p => !!(p.isFinished) === isShownOldProjects)
                        */}
                        {currentProjects.filter(!isShownOldProjects
                                                                    ? (p => (p.isFinished === false) || (p.isFinished === undefined))
                                                                    : (p => (p.isFinished === true)))
                            .reverse()
                            .map(p => (
                                <LinkComponentTitle
                                    href={`/project-board/${params.teamid}/${p._id}`}
                                    key={p._id}
                                    title={p.name}
                                    onClick={() => { setIsProjectActive(false) }}
                                    className={commonStyles.options}
                                />
                            ))
                        }
                    </div>
                    <ButtonClean
                        onClick={() => setIsShownProjectForm(true)}
                        title='Create Project'
                        className={`${commonStyles.options} ${commonStyles['last-option']}`}
                    />
                </div>}
            </div>
            {isShownProjectForm &&  <Transparent hideForm={() => setIsShownProjectForm(false)}>
                                        <CreateProject hideForm={() => setIsShownProjectForm(false)} />
                                    </Transparent>}
        </div>
    )
}

export default ProjectDropdown
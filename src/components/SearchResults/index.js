import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import TeamContext from '../../contexts/TeamContext'
import styles from './index.module.css'


const SearchResults = ({ searchInput, hideSearchResult }) => {
    const { user } = useContext(UserContext)
    const { updateSelectedTeam } = useContext(TeamContext)
    const history = useHistory()
    const teams = user.teams

    let resultArr = []

    for (let index = 0; index < teams.length; index++) {
        const team = teams[index];
        const currentTeam = { 'name': `Team: ${team.name}`, 'id': team._id, 'type': 'team' }
        resultArr.push(currentTeam)
        for (let index = 0; index < team.projects.length; index++) {
            const project = team.projects[index];
            const currentProject = { 'name': `Project: ${project.name}`,
                                    'id': project._id,
                                    'teamId': team._id,
                                    'type': 'project' }
            resultArr.push(currentProject)
        }
    }

    const goToPage = (element) => {

        if (element.type === 'project') {
            history.push(`/project-board/${element.teamId}/${element.id}`)
            updateSelectedTeam(element.teamId)
            hideSearchResult()
            return
        }

        history.push(`/team/${element.id}`)
        updateSelectedTeam(element.id)
        hideSearchResult()
    }

    return (
        <div className={styles['search-container']}>
            {
                resultArr.filter(line => line.name.toLowerCase().includes(searchInput.toLowerCase()))
                    .map((element, index) => {
                        return (
                            <div
                                key={index}
                                className={styles.result}
                                onClick={() => goToPage(element)}
                            >
                                {element.name}
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default SearchResults
import React, { useContext,useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import TeamContext from '../../contexts/TeamContext'
import styles from './index.module.css'


const SearchResults = ({ searchInput, hideSearchResult }) => {
    const { user: { teams } } = useContext(UserContext)
    const { updateSelectedTeam } = useContext(TeamContext)
    const history = useHistory()

    const searchResults = useMemo(() => {
        const searchResultsArray = []
        for (const team of teams) {
            if (team.name.toLowerCase().includes(searchInput.toLowerCase())) {
                searchResultsArray.push({ name: `Team: ${team.name}`, id: team._id, type: 'team' })
            }

            for (const project of team.projects) {
                if (project.name.toLowerCase().includes(searchInput.toLowerCase())) {
                    searchResultsArray.push({ 
                        name: `Project: ${project.name}`,
                        id: project._id,
                        teamId: team._id,
                        type: 'project' 
                    })
                }
            }
        }

        return searchResultsArray
    },[teams, searchInput])

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
                searchResults.map((element, index) => {
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
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import TeamContext from '../../contexts/TeamContext'
import styles from './index.module.css'


const SearchResults = ({ searchInput, hideSearchResult }) => {
    /* При положение, че от user ти трябва само user.teams, по-добре направо тук да се вземе само той. Така както е в момента,
        на всяко презареждане ще се прави нова променлива const teams = user.teams. Няма да се усети по някакъв начин, но все
        пак ще е по-добре да се махне тая променлива и да се взима teams така:
        const { user: { teams } } = useContext(UserContext)
    */
    const { user } = useContext(UserContext)
    const { updateSelectedTeam } = useContext(TeamContext)
    const history = useHistory()
    const teams = user.teams

    /* REVIEW: 
        1) Това resultArr по-добре да се направи на useMemo(() => { ... }, [teams, searchInput])
        Защо го има и searchInput в масива на useMemo - виж 7) 
        Така няма да се пресмята всеки път като се презарежда компонента. 
        2) Името не е мн добро за тази променлива, resultArr може да е много неща. Може да стане searchResultArr или просто
        searchResults (след 7-ма точка ще стане валидно това име за тая променлива)
        3) Тези for цикли спокойно могат да станат for-of цикли. Индекса не ни трябва в случая:
            -  for (const team of teams) {
                ...
            }
            - for (const project of team.projects) {
                ...
            }
        4) Имената на пропъртита на обекти няма нужда да са в кавички, освен ако не съдържат забранени знаци (най-често
        . или -). За стойностите това не важи, обаче, там винаги трябват кавички. Може да стане:
        const currentTeam = { name: `Team: ${team.name}`, id: team._id, type: 'team' }
        5) Същото като 4) важи и за currentProject, само че той не е и подреден мн добре. Добре е написан на няколко реда,
        обаче като се пише на няколко реда обект, обикновено се подрежда така:
        const currentProject = { 
            name: `Project: ${project.name}`,
            id: project._id,
            teamId: team._id,
            type: 'project' 
        }
        6) На две места има ; ама те така или иначе трябва да се изтрият като се мине на for-of цикли
        7) По-надолу, в самия return на компонента, на същия този resultArr, се прави .filter. Спокойно тази филтрация може
        да стане още тук при useMemo-то, като най-добре да се избегне викането на .filter и да се проверява още във for 
        циклите. Така ще се избегне изциклянето на проектите и отборите втори път:
        for (const team of teams) {
            if (team.name.toLowerCase().includes(searchInput.toLowerCase())) {
                searchResults.push({ name: `Team: ${team.name}`, id: team._id, type: 'team' })
            }

            for (const project of team.projects) {
                if (project.name.toLowerCase().includes(searchInput.toLowerCase())) {
                    searchResults.push({ 
                        name: `Project: ${project.name}`,
                        id: project._id,
                        teamId: team._id,
                        type: 'project' 
                    })
                }
            }
        }
    */
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
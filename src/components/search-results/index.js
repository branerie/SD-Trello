import React, { useContext } from 'react'
import styles from "./index.module.css"
import UserContext from "../../contexts/UserContext"
import { useHistory } from 'react-router-dom'
import TeamContext from "../../contexts/TeamContext"


export default function SearchResults(props) {
    const userContext = useContext(UserContext)
    const history = useHistory()
    const teamContext = useContext(TeamContext)


    const teams = userContext.user.teams

    const searchInput = props.searchInput

    let resultArr = []

    for (let index = 0; index < teams.length; index++) {
        const team = teams[index];
        let obj = { 'name': team.name, 'id': team._id, 'type': 'team' }
        resultArr.push(obj)
        for (let index = 0; index < team.projects.length; index++) {
            const project = team.projects[index];
            let obj = { 'name': project.name, 'id': project._id, 'type': 'project' }
            resultArr.push(obj)
        }
    }

    const gotToPage = (id) => {
        for (let index = 0; index < teams.length; index++) {
            const team = teams[index];
            if (team._id === id) {
                history.push(`/team/${id}`)
                teamContext.updateSelectedTeam(team._id)
                props.hideForm()
            }
            for (let index = 0; index < team.projects.length; index++) {
                const project = team.projects[index];
                if (project._id === id) {
                    history.push(`/project-board/${team._id}/${project._id}`)
                    teamContext.updateSelectedTeam(team._id)
                    props.hideForm()
                }
            }
        }
    }


    // teams.filter(u => u.name.toLowerCase().includes(searchInput.toLowerCase()))
    //                         .filter((e) => {
    //                             const found = members.find(element => element.username === e.username)
    //                             if (found) {
    //                                 return false
    //                             } else {
    //                                 return true
    //                             }
    //                         })

    return (
        <div className={styles.searchContainer}>
            {
                resultArr.filter(u => u.name.toLowerCase().includes(searchInput.toLowerCase()))
                    .map((t, index) => {
                        return (
                            <div key={index} onClick={() => { gotToPage(t.id) }}>{t.name}</div>
                        )
                    })
            }
        </div>
    )
}

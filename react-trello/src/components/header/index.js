import React, { useContext, useRef, useState } from "react"
import styles from "./index.module.css"
import UserContext from "../../contexts/UserContext"
import Avatar from "react-avatar"
import { useDetectOutsideClick } from "../../utils/useDetectOutsideClick"
import LinkComponent from "../link"
import ButtonClean from "../button-clean"
import TeamContext from "../../contexts/TeamContext"
import Transparent from "../transparent"
import CreateTeam from "../create-team"
import { useHistory } from "react-router-dom"

const Header = ({ asideOn }) => {
    const dropdownRef = useRef(null)
    const [isProfileActive, setIsProfileActive] = useDetectOutsideClick(dropdownRef, false)
    const [isViewActive, setIsViewActive] = useDetectOutsideClick(dropdownRef, false)
    const [showForm, setShowForm] = useState(false)
    const context = useContext(UserContext)
    const teamContext = useContext(TeamContext)
    const history = useHistory()

    function handleSelect(teamId) {
        if (teamId === 'select') {
            return
        }

        if (teamId === 'create') {
            setShowForm(true)
            return
        }

        console.log('handle select header', teamId);

        teamContext.setOption(teamId)
        teamContext.getCurrentProjects(teamId)
        history.push(`/team/${teamId}`)
    }

    return (
        <header className={`${styles.navigation} ${asideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>
                    <div className={styles.margin}>
                        Change
                    </div>
                    <div>
                        <ButtonClean
                            className={styles.view}
                            onClick={() => setIsViewActive(!isViewActive)}
                            title='View'
                        />
                        {
                            isViewActive ? <div
                                ref={dropdownRef}
                                className={styles.options}
                            >
                                <div>
                                    <LinkComponent
                                        href={`/profile/${context.user && context.user.id}`}
                                        title='Profile'
                                    />
                                </div>
                                <div>
                                    <LinkComponent
                                        href={`/profile/${context.user && context.user.id}`}
                                        title='Profile'
                                    />
                                </div>
                            </div> : null
                        }
                    </div>
                    <div className={styles.margin}>
                        Teams:
                    </div>
                    <select value={teamContext.option} className={styles.select} onChange={(e) => { handleSelect(e.target.value) }}>
                        <option value='select'>Select</option>
                        {
                            teamContext.teams.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))
                        }
                        <option value='create'>Create New Team</option>
                    </select>
                </div>
                {
                    showForm ? (<Transparent hideForm={() => setShowForm(false)}>
                        <CreateTeam setOption={teamContext.setOption} hideForm={() => { setShowForm(false) }} ></CreateTeam>
                    </Transparent>) : null
                }
                <div className={`${styles.links} ${styles.font}`}>
                    <input className={styles.input} type='text' placeholder='Search...' />
                    <ButtonClean
                        className={styles.avatar}
                        onClick={() => setIsProfileActive(!isProfileActive)}
                        title={<Avatar name={context.user.username} size={40} round={true} maxInitials={2} />}
                    />
                    {
                        isProfileActive ? <div
                            ref={dropdownRef}
                            className={styles.options}
                        >
                            <div>
                                <LinkComponent
                                    href={`/profile/${context.user && context.user.id}`}
                                    title='Profile'
                                />
                            </div>
                            <div>
                                <ButtonClean
                                    onClick={context.logOut}
                                    title='Log Out'
                                    className={styles.logout}
                                />
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        </header>
    )
}

export default Header
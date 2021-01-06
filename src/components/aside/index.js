import React, { useContext, useState, useEffect } from 'react'
import LinkComponent from '../link'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import menu from '../../images/aside/menu.svg'
import home from '../../images/aside/home.svg'
import tasks from '../../images/aside/tasks.svg'
import inbox from '../../images/aside/inbox.svg'
import settings from '../../images/aside/settings.svg'
import ProjectContext from '../../contexts/ProjectContext'
import ButtonHideList from '../button-hide-list'
import ButtonClean from '../button-clean'
import UserContext from '../../contexts/UserContext'

export default function Aside({ asideOn, setAsideOn }) {
    const [listVisibility, setListVisibility] = useState(false)
    const projectContext = useContext(ProjectContext)
    const userContext = useContext(UserContext)

    useEffect(() => {
        if (window.location.href.includes('project')) {
            setListVisibility(true)
        }
    }, [])

    return (
        <div className={styles.aside}>
            <aside className={styles.container}>
                <div className={styles.topleft}>
                    <ButtonClean
                        onClick={() => setAsideOn(!asideOn)}
                        title={<img className={styles.options} src={menu} alt="menu" width="32" height="24" />}
                    />
                </div>
                <LinkComponent
                    href='/'
                    title={<img src={home} alt="home" width="34" height="32" />}
                />
                <LinkComponent
                    href={`/my-tasks/${userContext.user.id}`}
                    title={<img src={tasks} alt="my-tasks" width="30" height="25" />}
                />
                <LinkComponent
                    href={`/inbox/${userContext.user.id}`}
                    title={<img src={inbox} alt="inbox" width="33" height="34" />}
                />
                <LinkComponent
                    href='/'
                    title={<img src={settings} alt="settings" width="25" height="25" />}
                />
            </aside>
            {
                asideOn ?
                    <div className={styles.menu}>
                        <div className={styles.topright}>
                            <div className={styles.logo}>
                                <img src={logo} alt="logo" width="87" height="65" />
                            </div>
                            <LinkComponent
                                href='/'
                                title='Home'
                                className={styles.link}
                            />
                            <LinkComponent
                                href={`/my-tasks/${userContext.user.id}`}
                                title='My Tasks'
                                className={styles.link}
                            />
                            <LinkComponent
                                href={`/inbox/${userContext.user.id}`}
                                title='Inbox'
                                className={styles.link}
                            />
                            <LinkComponent
                                href='/'
                                title='Settings'
                                className={styles.link}
                            />
                        </div>
                        {listVisibility && <div className={styles.bottomright}>
                            {
                                projectContext.lists.map((element, index) => {
                                    return (
                                        <ButtonHideList key={element._id} list={element} type={'aside'} />
                                    )
                                })
                            }
                        </div>}
                    </div> : null
            }

        </div>
    )
}
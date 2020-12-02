import React, { useContext } from 'react'
import LinkComponent from '../link'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import menu from '../../images/menu.svg'
import home from '../../images/home.svg'
import tasks from '../../images/tasks.svg'
import inbox from '../../images/inbox.svg'
import LinkAside from '../link-aside'
import ProjectContext from '../../contexts/ProjectContext'
import ButtonHideList from '../button-hide-list'
import ButtonClean from '../button-clean'

export default function Aside({ asideOn, setAsideOn }) {
    const projectContext = useContext(ProjectContext)

    return (
        <div>
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
                    href='/'
                    title={<img src={tasks} alt="my-tasks" width="30" height="25" />}
                />
                <LinkComponent
                    href='/'
                    title={<img src={inbox} alt="inbox" width="33" height="34" />}
                />
            </aside>
            {
                asideOn ?
                    <div className={styles.menu}>
                        <div className={styles.topright}>
                            <div className={styles.logo}>
                                <img src={logo} alt="logo" width="87" height="65" />
                            </div>
                            <LinkAside
                                href='/'
                                title='Home'
                            />
                            <LinkAside
                                href='/'
                                title='My Tasks'
                            />
                            <div className={styles.inbox}>
                                <LinkAside
                                    href='/'
                                    title='Inbox'
                                />
                            </div>
                        </div>
                        <div className={styles.bottomright}>
                            {
                                projectContext.lists.map((element, index) => {
                                    return (
                                            <ButtonHideList key={element._id} list={element} type={'aside'} />
                                    )
                                })
                            }
                        </div>
                    </div> : null
            }

        </div>
    )
}
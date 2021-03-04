import React, { useContext, useState, useEffect, useCallback } from 'react'
import LinkComponent from '../link'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import menu from '../../images/aside/menu.svg'
import home from '../../images/aside/home.svg'
import tasks from '../../images/aside/tasks.svg'
import inbox from '../../images/aside/inbox.svg'
import bell from '../../images/aside/inbox-bell.svg'
import projectInfo from '../../images/aside/project-info.svg'
// import settings from '../../images/aside/settings.svg'
import ProjectContext from '../../contexts/ProjectContext'
import ButtonHideList from '../button-hide-list'
import ButtonClean from '../button-clean'
import UserContext from '../../contexts/UserContext'
import userObject from '../../utils/userObject'
import { useSocket } from '../../contexts/SocketProvider'
import Transparent from '../transparent'
import EditProject from '../edit-project'

export default function Aside({ asideOn, setAsideOn }) {
    const [listVisibility, setListVisibility] = useState(false)
    const [editProjectVisibility, setEditProjectVisibility] = useState(false)
    const [editProjectButtonVisibility, setEditProjectButtonVisibility] = useState(false)
    const projectContext = useContext(ProjectContext)
    const userContext = useContext(UserContext)
    const socket = useSocket()
    const logIn = userContext.logIn

    useEffect(() => {
        if (window.location.href.includes('project')) {
            setListVisibility(true)
            setEditProjectButtonVisibility(true)
        }
    }, [])

    const updateUser = useCallback(async (response) => {
        const user = userObject(response)
        logIn(user)
    }, [logIn])

    useEffect(() => {
        if (socket) {
            socket.on('message-sent', updateUser)
            return () => socket.off('message-sent')
        }
    }, [socket, updateUser])

    return (
        <div className={styles.aside}>
            <aside className={styles.container}>
                <div className={styles['top-left']}>
                    <ButtonClean
                        className={styles.hamburger}
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
                {editProjectButtonVisibility &&
                    <ButtonClean
                        className={styles.settings}
                        onClick={() => setEditProjectVisibility(!editProjectVisibility)}
                        title={<img className={styles.options} src={projectInfo} alt="" width="40" />}
                    />
                }
                {/* <LinkComponent
                    href={`/profile/${userContext.user.id}`}
                    title={<img src={settings} alt="settings" width="25" height="25" />}
                /> */}
                {userContext.user.inbox.length !== 0 &&
                    <LinkComponent
                        href={`/inbox/${userContext.user.id}`}
                        title={<img src={bell} alt="inbox" width="33" height="34" />}
                        className={styles.bell}
                    />
                }
            </aside>
            {asideOn &&
                <div className={styles.menu}>
                    <div className={styles['top-right']}>
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
                        {editProjectButtonVisibility &&
                            <ButtonClean
                                className={styles.link}
                                onClick={() => setEditProjectVisibility(!editProjectVisibility)}
                                title={'Settings'}
                            />
                        }
                        {/* <LinkComponent
                            href={`/profile/${userContext.user.id}`}
                            title='Settings'
                            className={styles.link}
                        /> */}
                    </div>
                    {listVisibility && <div className={styles['bottom-right']}>
                        {
                            projectContext.lists.map((element) => {
                                return (
                                    <ButtonHideList key={element._id} list={element} type={'aside'} />
                                )
                            })
                        }
                    </div>}
                </div>
            }

            {editProjectVisibility &&
                < div >
                    <Transparent hideForm={() => setEditProjectVisibility(!editProjectVisibility)} >
                        <EditProject hideForm={() => setEditProjectVisibility(!editProjectVisibility)} project={projectContext.project} />
                    </Transparent >
                </div >
            }

        </div>
    )
}
import React, { useContext, useState, useEffect, useCallback } from 'react'
import LinkComponent from '../Link'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import menu from '../../images/aside/menu.svg'
import home from '../../images/aside/home.svg'
import tasks from '../../images/aside/tasks.svg'
import inbox from '../../images/aside/inbox.svg'
import bell from '../../images/aside/inbox-bell.svg'
import projectInfo from '../../images/aside/project-info.svg'
import ProjectContext from '../../contexts/ProjectContext'
import ButtonHideList from '../ButtonHideList'
import ButtonClean from '../ButtonClean'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import Transparent from '../Transparent'
import EditProject from '../EditProject'

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
        logIn(response)
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
                        title={<img className={styles.options} src={menu} alt='menu' width='32' height='24' />}
                    />
                </div>
                <LinkComponent
                    href='/'
                    title={<img src={home} alt='home' width='34' height='32' />}
                />
                <LinkComponent
                    href={`/my-tasks/${userContext.user.id}`}
                    title={<img src={tasks} alt='my-tasks' width='30' height='25' />}
                />
                <LinkComponent
                    href={`/inbox/${userContext.user.id}`}
                    title={<>
                        <img src={inbox} alt='inbox' width='33' height='34' />
                        {userContext.user.inbox.length !== 0 &&
                            <img className={styles.bell} src={bell} alt='inbox' width='33' height='34' />
                        }
                    </>}
                />
                {editProjectButtonVisibility &&
                    <ButtonClean
                        className={styles.settings}
                        onClick={() => setEditProjectVisibility(!editProjectVisibility)}
                        title={<img className={styles.options} src={projectInfo} alt='' width='40' />}
                    />
                }
            </aside>
            {asideOn &&
                <div className={styles.menu}>
                    <div className={styles['top-right']}>
                        <div className={styles.logo}>
                            <img src={logo} alt='logo' width='87' height='65' />
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
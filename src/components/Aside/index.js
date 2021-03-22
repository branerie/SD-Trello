import React, { useContext, useState, useEffect, useCallback } from 'react'
import LinkComponent from '../Link'
import UserContext from '../../contexts/UserContext'
import { useSocket } from '../../contexts/SocketProvider'
import ProjectContext from '../../contexts/ProjectContext'
import styles from './index.module.css'
import ButtonHideList from '../ButtonHideList'
import ButtonClean from '../ButtonClean'
import Transparent from '../Transparent'
import EditProject from '../EditProject'
import logo from '../../images/logo.svg'
import menu from '../../images/aside/menu.svg'
import home from '../../images/aside/home.svg'
import tasks from '../../images/aside/tasks.svg'
import inbox from '../../images/aside/inbox.svg'
import bell from '../../images/aside/inbox-bell.svg'
import projectInfo from '../../images/aside/project-info.svg'

const Aside = ({ isAsideOn, setIsAsideOn }) => {
    const [isListShown, setIsListShown] = useState(false)
    const [isEditProjectShown, setIsEditProjectShown] = useState(false)
    const [isEditButtonProjectShown, setIsEditButtonProjectShown] = useState(false)
    const { lists, project } = useContext(ProjectContext)
    const { user, logIn } = useContext(UserContext)
    const socket = useSocket()

    useEffect(() => {
        if (window.location.href.includes('project')) {
            setIsListShown(true)
            setIsEditButtonProjectShown(true)
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
                        onClick={() => setIsAsideOn(!isAsideOn)}
                        title={<img className={styles.options} src={menu} alt='menu' width='32' height='24' />}
                    />
                </div>
                <LinkComponent
                    href='/'
                    title={<img src={home} alt='home' width='34' height='32' />}
                />
                <LinkComponent
                    href={`/my-tasks/${user.id}`}
                    title={<img src={tasks} alt='my-tasks' width='30' height='25' />}
                />
                <LinkComponent
                    href={`/inbox/${user.id}`}
                    title={<>
                        <img src={inbox} alt='inbox' width='33' height='34' />
                        {user.inbox.length !== 0 &&
                            <img className={styles.bell} src={bell} alt='inbox' width='33' height='34' />
                        }
                    </>}
                />
                {isEditButtonProjectShown &&
                    <ButtonClean
                        className={styles.settings}
                        onClick={() => setIsEditProjectShown(!isEditProjectShown)}
                        title={<img className={styles.options} src={projectInfo} alt='' width='40' />}
                    />
                }
            </aside>
            {isAsideOn &&
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
                            href={`/my-tasks/${user.id}`}
                            title='My Tasks'
                            className={styles.link}
                        />
                        <LinkComponent
                            href={`/inbox/${user.id}`}
                            title='Inbox'
                            className={styles.link}
                        />
                        {isEditButtonProjectShown &&
                            <ButtonClean
                                className={styles.link}
                                onClick={() => setIsEditProjectShown(!isEditProjectShown)}
                                title={'Settings'}
                            />
                        }
                    </div>
                    {isListShown && <div className={styles['bottom-right']}>
                        {
                            lists.map((element) => {
                                return (
                                    <ButtonHideList key={element._id} list={element} type={'aside'} />
                                )
                            })
                        }
                    </div>}
                </div>
            }
            {isEditProjectShown &&
                < div >
                    <Transparent hideForm={() => setIsEditProjectShown(!isEditProjectShown)} >
                        <EditProject hideForm={() => setIsEditProjectShown(!isEditProjectShown)} project={project} />
                    </Transparent >
                </div >
            }
        </div>
    )
}

export default Aside
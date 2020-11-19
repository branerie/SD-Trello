import React, { useContext } from 'react'
import UserContext from '../../Context'
import LinkComponent from '../link'
import styles from './index.module.css'

export default function Aside({ asideOn, setAsideOn }) {
    const context = useContext(UserContext)

    function onClick() {
        setAsideOn(!asideOn)
    }

    return (
        <div>
            <aside className={styles.container}>
                <div className={styles.top}>
                    <button onClick={onClick}>
                        Menu
                    </button>
                </div>
                <LinkComponent
                    href='/'
                    title='Home'
                />
                <LinkComponent
                    href='/projects'
                    title='Projects'
                />
                <LinkComponent
                    href={`/profile/${context.user && context.user.id}`}
                    title='Profile'
                />
            </aside>
            {
                asideOn ?
                    <div className={styles.menu}>
                        <div className={styles.top}>
                            Logo
                        </div>
                        <LinkComponent
                            href='/'
                            title='Home'
                        />
                        <LinkComponent
                            href='/'
                            title='My Tasks'
                        />
                        <div className={styles.bottom}>
                            <LinkComponent
                                href='/'
                                title='Inbox'
                            />
                        </div>
                    </div> : null
            }

        </div>
    )
}
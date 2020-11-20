import React, { useContext, useRef } from "react"
import styles from "./index.module.css"
import UserContext from "../../Context"
import Avatar from "react-avatar"
import { useDetectOutsideClick } from "../../utils/useDetectOutsideClick"
import LinkComponent from "../link"


const Header = ({ asideOn }) => {
    const dropdownRef = useRef(null)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
    const context = useContext(UserContext)

    const onClick = () => setIsActive(!isActive)

    return (
        <header className={`${styles.navigation} ${asideOn ? styles.small : ''}`} >
            <div className={styles.container}>
                <div className={styles.links}>
                    <div className={styles.margin}>
                        Change View
                </div>
                    <div className={styles.margin}>
                        Teams:
                </div>
                </div>
                <div className={styles.links}>
                    <input className={styles.input} type='text' placeholder='Search...' />
                    <button className={styles.avatar} onClick={onClick} >
                        <Avatar name={context.user.username} size={40} round={true} maxInitials={2} />
                    </button>
                    {
                        isActive ? <div
                            ref={dropdownRef}
                            className={styles.logout}
                        >
                            <div>
                                <LinkComponent
                                    href={`/profile/${context.user && context.user.id}`}
                                    title='Profile'
                                />
                            </div>
                            <div>
                                <button onClick={context.logOut}>Log Out</button>
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        </header>
    )
}

export default Header
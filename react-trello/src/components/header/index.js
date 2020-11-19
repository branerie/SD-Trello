import React, { useContext } from "react";
import styles from "./index.module.css";
import UserContext from "../../Context";
import { Link } from "react-router-dom";

const Header = ({ asideOn }) => {
    const context = useContext(UserContext);

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
                    <span className={styles.margin}>{context.user.username}</span>
                    <button className={styles.logout} onClick={context.logOut}>Log Out</button>
                </div>
            </div>
        </header>
    )
}

export default Header;
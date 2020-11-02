import React, { Component } from "react";
import Link from "../link";
import styles from "./index.module.css";
// import logo from "../../images/white-origami-bird.png";
import getNavigation from "../../utils/navigation";
import UserContext from "../../Context";

class Header extends Component {

    static contextType = UserContext;

    render() {

        const {
            user
        } = this.context

        const links = getNavigation(user);
        const otherLinks = links.filter(a => {
            return (a.title !== 'Login' && a.title !== 'Logout' && a.title !== 'Sign-up')
        })

        const userLinks = links.filter(a => {
            return (a.title === 'Login' || a.title === 'Logout' || a.title === 'Sign-up')
        })

        
        return (
            <header className={styles.navigation}>
                {/* <img alt="logo" className={styles.logo} src={logo} /> */}
                <div className={styles.links}>
                {
                    otherLinks.map(navElement => {
                        return (
                            <Link
                                key={navElement.title}
                                href={navElement.link}
                                title={navElement.title}
                            />
                        )
                    })
                }
                </div>
                <div className={styles.links}>
                {
                    userLinks.map(navElement => {
                        return (
                            <Link
                                key={navElement.title}
                                href={navElement.link}
                                title={navElement.title}
                            />
                        )
                    })
                }
                </div>
            </header>
        )
    }
};

export default Header;
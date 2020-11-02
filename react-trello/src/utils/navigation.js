const getNavigation = (user) => {

    const authLinks = [
        {
            title: "Home",
            link: "/"
        },
        {
            title: "Projects",
            link: "/projects"
        },
        {
            title: "Profile",
            link: `/profile/${user && user.id}`
        }
    
    ];

    const guestLinks = [
        {
            title: "Home",
            link: "/"
        },
        {
            title: "Login",
            link: "/login"
        },
        {
            title: "Sign-up",
            link: "/sign-up"
        }
    
    ];

    const loggedIn = user.loggedIn;
    return loggedIn ? authLinks : guestLinks;
};

export default getNavigation;
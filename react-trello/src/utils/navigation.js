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
        },
        {
            title: "Log Out",
            link: '/'
        }
    
    ];

    const guestLinks = [
        {
            title: "Home",
            link: "/"
        },
        {
            title: "Log In",
            link: "/login"
        },
        {
            title: "Sign Up",
            link: "/sign-up"
        }
    
    ];

    const loggedIn = user.loggedIn;
    return loggedIn ? authLinks : guestLinks;
};

export default getNavigation;
import React, { useContext } from "react"
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom"

import Home from "./pages/home"
import SignupPage from "./pages/signup"
import LoginPage from "./pages/login"
import ProfilePage from "./pages/profile"
import ErrorPage from "./pages/error"
import UserContext from "./Context"
import ProjectsPage from "./pages/project"

const Navigation = () => {

    const context = useContext(UserContext)
    const loggedIn = context.user.loggedIn;

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/sign-up">
                    {loggedIn ? (<Redirect to="/" />): (<SignupPage />)}
                </Route>
                <Route path="/login">
                    {loggedIn ? (<Redirect to="/" />): (<LoginPage />)}
                </Route>
                <Route path="/profile/:userid">
                    {loggedIn ? (<ProfilePage />): (<Redirect to="/login"/>)}
                </Route>
                <Route path="/projects">
                    {loggedIn ? (<ProjectsPage />): (<Redirect to="/login"/>)}
                </Route>
                {/* <Route path="/projects/:projectid">
                    {loggedIn ? (<ProjectPage />): (<Redirect to="/login"/>)}
                </Route> */}
                <Route component={ErrorPage} />
            </Switch>
        </BrowserRouter>
    )
}

export default Navigation
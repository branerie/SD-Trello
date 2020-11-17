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
import AllProjectsPage from "./pages/all-project"
import ProjectPage from "./pages/project-page"
import { SocketProvider } from "./contexts/SocketProvider"

const Navigation = () => {

    const context = useContext(UserContext)
    const loggedIn = context.user.loggedIn

    return (
        <SocketProvider user={context.user.username}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/sign-up">
                        {loggedIn ? (<Redirect to="/" />) : (<SignupPage />)}
                    </Route>
                    <Route path="/login">
                        {loggedIn ? (<Redirect to="/" />) : (<LoginPage />)}
                    </Route>
                    <Route path="/profile/:userid">
                        {loggedIn ? (<ProfilePage />) : (<Redirect to="/login" />)}
                    </Route>
                    <Route path="/projects/:projectid">
                        {loggedIn ? (<ProjectPage />) : (<Redirect to="/login" />)}
                    </Route>
                    <Route path="/projects">
                        {loggedIn ? (<AllProjectsPage />) : (<Redirect to="/login" />)}
                    </Route>
                    <Route component={ErrorPage} />
                </Switch>
            </BrowserRouter>
        </SocketProvider>
    )
}

export default Navigation
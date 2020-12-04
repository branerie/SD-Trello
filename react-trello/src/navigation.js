import React, { useContext } from "react"
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom"

import Home from "./pages/home"
import WelcomePage from "./pages/welcome"
import SignupPage from "./pages/signup"
import LoginPage from "./pages/login"
import ProfilePage from "./pages/profile"
import ErrorPage from "./pages/error"
import UserContext from "./contexts/UserContext"
import ProjectBoard from "./pages/project-board"
import ProjectList from "./pages/project-list"
import { SocketProvider } from "./contexts/SocketProvider"
import ProjectProvider from "./contexts/ProjectProvider"
import TeamProvider from "./contexts/TeamProvider"
import TeamPage from "./pages/team"

const Navigation = () => {

    const context = useContext(UserContext)
    const loggedIn = context.user.loggedIn

    return (
        <SocketProvider user={context.user}>
            <ProjectProvider>
                <TeamProvider>
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" >
                                {loggedIn ? (<Home />) : (<WelcomePage />)}
                            </Route>
                            <Route path="/sign-up">
                                {loggedIn ? (<Redirect to="/" />) : (<SignupPage />)}
                            </Route>
                            <Route path="/login">
                                {loggedIn ? (<Redirect to="/" />) : (<LoginPage />)}
                            </Route>
                            <Route path="/profile/:userid">
                                {loggedIn ? (<ProfilePage />) : (<Redirect to="/login" />)}
                            </Route>
                            <Route path="/project-board/:teamid/:projectid">
                                {loggedIn ? (<ProjectBoard />) : (<Redirect to="/login" />)}
                            </Route>
                            <Route path="/project-list/:teamid/:projectid">
                                {loggedIn ? (<ProjectList />) : (<Redirect to="/login" />)}
                            </Route>
                            <Route path="/team/:teamid">
                                {loggedIn ? (<TeamPage />) : (<Redirect to="/login" />)}
                            </Route>
                            <Route component={ErrorPage} />
                        </Switch>
                    </BrowserRouter>
                </TeamProvider>
            </ProjectProvider>
        </SocketProvider>
    )
}

export default Navigation
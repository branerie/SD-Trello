import React, { useContext } from "react"
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom"

import Home from "./pages/home"
import WelcomePage from "./pages/welcome"
import ProfilePage from "./pages/profile"
import InboxPage from "./pages/inbox"
import MyTasksPage from "./pages/my-tasks"
import ErrorPage from "./pages/error"
import GetStarted from "./pages/get-started"
import UserContext from "./contexts/UserContext"
import ProjectBoard from "./pages/project-board"
import ProjectList from "./pages/project-list"
import { SocketProvider } from "./contexts/SocketProvider"
import ProjectProvider from "./contexts/ProjectProvider"
import TeamProvider from "./contexts/TeamProvider"
import TeamPage from "./pages/team"
import ConfirmationPage from "./pages/confirmation"
import {CloudinaryContext} from 'cloudinary-react'

const Navigation = () => {

    const context = useContext(UserContext)
    const loggedIn = context.user.loggedIn

    return (
        <BrowserRouter>
            <SocketProvider user={context.user}>
                <ProjectProvider>
                    <TeamProvider>
                        <CloudinaryContext cloudName={process.env.REACT_APP_CLOUD_NAME}>
                            <Switch>
                                <Route path="/confirmation/:token"><ConfirmationPage /></Route>
                                {((loggedIn && !context.user.confirmed)
                                    || (loggedIn && !context.user.newPasswordConfirmed)
                                ) && <Redirect to="/confirmation/not-confirmed" />}
                                <Route exact path="/" >
                                    {loggedIn ? (<Home />) : (<WelcomePage />)}
                                </Route>
                                <Route path="/get-started/">
                                    {loggedIn ? (<GetStarted />) : (<Redirect to="/" />)}
                                </Route>
                                <Route path="/profile/:userid">
                                    {loggedIn ? (<ProfilePage />) : (<Redirect to="/" />)}
                                </Route>
                                <Route path="/inbox/:userid">
                                    {loggedIn ? (<InboxPage />) : (<Redirect to="/" />)}
                                </Route>
                                <Route path="/my-tasks/:userid">
                                    {loggedIn ? (<MyTasksPage />) : (<Redirect to="/" />)}
                                </Route>
                                <Route path="/project-board/:teamid/:projectid">
                                    {loggedIn ? (<ProjectBoard />) : (<Redirect to="/" />)}
                                </Route>
                                <Route path="/project-list/:teamid/:projectid">
                                    {loggedIn ? (<ProjectList />) : (<Redirect to="/" />)}
                                </Route>
                                <Route path="/team/:teamid">
                                    {loggedIn ? (<TeamPage />) : (<Redirect to="/" />)}
                                </Route>
                                <Route component={ErrorPage} />
                            </Switch>
                        </CloudinaryContext>
                    </TeamProvider>
                </ProjectProvider>
            </SocketProvider>
        </BrowserRouter>
    )
}

export default Navigation
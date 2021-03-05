import React, { useContext } from "react"
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom"

import Home from "./pages/Home"
import WelcomePage from "./pages/Welcome"
import ProfilePage from "./pages/Profile"
import InboxPage from "./pages/Inbox"
import MyTasksPage from "./pages/MyTasks"
import ErrorPage from "./pages/Error"
import GetStarted from "./pages/GetStarted"
import UserContext from "./contexts/UserContext"
import ProjectBoard from "./pages/ProjectBoard"
import ProjectList from "./pages/ProjectList"
import { SocketProvider } from "./contexts/SocketProvider"
import ProjectProvider from "./contexts/ProjectProvider"
import TeamProvider from "./contexts/TeamProvider"
import TeamPage from "./pages/Team"
import ConfirmationPage from "./pages/Confirmation"
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
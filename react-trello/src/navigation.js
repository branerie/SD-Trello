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
import ProjectPage from "./pages/project-page"
import CalendarView from "./pages/calendar-view"
import { SocketProvider } from "./contexts/SocketProvider"
import ListProvider from "./contexts/ListProvider"
import TeamProvider from "./contexts/TeamProvider"
import TeamPage from "./pages/team"

const Navigation = () => {

    const context = useContext(UserContext)
    const loggedIn = context.user.loggedIn

    return (
        <SocketProvider user={context.user.username}>
            <ListProvider>
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
                            <Route path="/projects/:projectid">
                                {loggedIn ? (<ProjectPage />) : (<Redirect to="/login" />)}
                            </Route>
                            <Route path="/calendarView/:projectid">
                                {loggedIn ? (<CalendarView />) : (<Redirect to="/login" />)}
                            </Route>
                            <Route path="/team/:teamid">
                                {/* <CurrentTeamProvider> */}
                                    {loggedIn ? (<TeamPage />) : (<Redirect to="/login" />)}
                                {/* </CurrentTeamProvider> */}
                            </Route>
                            <Route component={ErrorPage} />
                        </Switch>
                    </BrowserRouter>
                </TeamProvider>
            </ListProvider>
        </SocketProvider>
    )
}

export default Navigation
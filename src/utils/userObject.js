function userObject(response) {
    return {
        username: response.user.username,
        id: response.user._id,
        teams: response.teams,
        inbox: response.user.inbox,
        confirmed: response.user.confirmed,
        recentProjects: response.user.recentProjects
    }
}

export default userObject
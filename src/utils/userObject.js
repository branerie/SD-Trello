function userObject(response) {
    return {
        username: response.user.username,
        id: response.user._id,
        teams: response.teams,
        inbox: response.user.inbox,
        confirmed: response.user.confirmed,
        newPasswordConfirmed: response.user.newPasswordConfirmed,
        recentProjects: response.user.recentProjects,
        image: response.user.image
    }
}

export default userObject
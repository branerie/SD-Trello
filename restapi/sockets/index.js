const models = require('../models')
const getTeams = require('../utils/getTeams')
const userInbox = require('../utils/userInbox')

function sockets(socket) {

    const username = socket.handshake.query.username
    const userId = socket.handshake.query.userId
    socket.join(userId)
    console.log(username, 'connected')
    const teams = JSON.parse(socket.handshake.query.teamsStr)
    teams.map(t => socket.join(t))

    socket.on('team-update', async (teamId) => {
        console.log(username, 'team-update')
        const updatedTeam = await teamUpdate(teamId)
        socket.to(teamId).emit('team-updated', updatedTeam)
        socket.emit('team-updated', updatedTeam)
    })

    socket.on('team-deleted', async (team) => {
        console.log(username, 'team-deleted')
        socket.to(team.id).emit('team-deleted', team.id)
        team.recievers.map(async r => {
            const user = await models.User.findOne({ _id: r }).select('-password')
            const teams = await getTeams(r)
            const inboxUser = await userInbox(r)
            const response = {
                user,
                teams,
                inboxUser
            }
            if (r === userId) {
                socket.emit('message-sent', response)
            }
            socket.to(`${r}`).emit('message-sent', response)
        })

    })

    socket.on('project-join', (projectId) => {
        console.log(`${username} joined ${projectId}`)
        socket.join(projectId)
    })

    socket.on('project-update', async (project) => {
        console.log(username, 'project-update')
        const updatedProject = await projectUpdate(project._id)
        socket.to(project._id).emit('project-updated', updatedProject)
        socket.emit('project-updated', updatedProject)
    })

    socket.on('task-team-join', (teamId) => {
        console.log(`${username} joined task-${teamId}`)
        socket.join(`task-${teamId}`)
    })

    socket.on('task-team-update', async (teamId) => {
        console.log(username, 'task-team-update')
        const updatedTeamProjects = await taskTeamUpdate(teamId, userId)
        socket.to(`task-${teamId}`).emit('task-update-team', teamId)
        socket.emit('task-team-updated', updatedTeamProjects)
    })

    socket.on('multiple-messages-sent', async (recievers) => {
        console.log(username, 'multiple-messages-sent')
        recievers.map(async r => {
            const user = await models.User.findOne({ _id: r._id }).select('-password')
            const teams = await getTeams(r._id)
            const inboxUser = await userInbox(r._id)
            const response = {
                user,
                teams,
                inboxUser
            }
            socket.to(`${r._id}`).emit('message-sent', response)
        })
    })

    socket.on('message-sent', async (recieverId) => {
        console.log(username, 'message-sent')
        const user = await models.User.findOne({ _id: recieverId }).select('-password')
        const teams = await getTeams(recieverId)
        const inboxUser = await userInbox(recieverId)
        const response = {
            user,
            teams,
            inboxUser
        }
        socket.to(`${recieverId}`).emit('message-sent', response)
        if (recieverId === userId) {
            socket.emit('message-sent', response)
        }
    })
}

async function teamUpdate(id) {
    try {
        const team = await models.Team.findOne({ _id: id })
            .populate({
                path: 'projects',
                populate: {
                    path: 'membersRoles',
                    populate: {
                        path: 'memberId'
                    }
                }
            })
            .populate({
                path: 'projects',
                populate: {
                    path: 'author'
                }
            })
            .populate({
                path: 'members'
            })
            .populate({
                path: 'requests'
            })

        return team

    } catch (error) {
        console.log(error);
    }
}

async function projectUpdate(id) {
    const project = await models.Project.findOne({ _id: id })
        .populate({
            path: 'lists',
            populate: {
                path: 'cards',
                populate: {
                    path: 'members'
                }
            }
        })
        .populate({
            path: 'membersRoles',
            populate: {
                path: 'memberId',
            }
        })
    return project
}

async function taskTeamUpdate(teamId, userId) {
    const team = await models.Team.findOne({ _id: teamId })
        .populate({
            path: 'projects',
            populate: {
                path: 'lists',
                populate: {
                    path: 'cards',
                    populate: {
                        path: 'members'
                    }
                }
            }
        })

    let projects = team.projects

    projects.forEach(p => p.lists.forEach(l => l.cards = l.cards.filter(c => {
        const isMembers = c.members.some(m => m._id.toString() == userId.toString())
        return isMembers
    })))
    projects.forEach(p => p.lists = p.lists.filter(l => l.cards.length !== 0))
    projects = projects.filter(p => p.lists.length !== 0)

    return projects
}

module.exports = sockets
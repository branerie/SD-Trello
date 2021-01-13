const models = require('../models')

function sockets(socket) {

    const username = socket.handshake.query.username
    const userId = socket.handshake.query.userId
    socket.join(userId)
    console.log(username, 'connected')
    const teams = JSON.parse(socket.handshake.query.teamsStr)
    teams.map( t => socket.join(t))
    
    socket.on('team-update', async (teamId) => {
        console.log(username, 'team-update')
        const updatedTeam = await teamUpdate(teamId)
        socket.to(teamId).emit('team-updated', updatedTeam)
        socket.emit('team-updated', updatedTeam)
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
                path: 'cards'
            }
        }
    })

let projects = team.projects

projects.forEach(p => p.lists.forEach(l => l.cards = l.cards.filter(c => c.members.includes(userId))))
projects.forEach(p => p.lists = p.lists.filter(l => l.cards.length !== 0))
projects = projects.filter(p => p.lists.length !== 0)

return projects
}

module.exports = sockets
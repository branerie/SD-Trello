const sockets = require('./sockets')
const dbConnection = require('./config/database')
const dotEnv = require("dotenv")
dotEnv.config()

require('express-async-errors')
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();

dbConnection().then(() => {

    require('./config/express')(app)

    const server = http.createServer(app);

    const io = socketIo(server);

    io.on('connection', socket => {

        const username = socket.handshake.query.username
        socket.join(username)
        console.log(username, 'connected')
        const teams = JSON.parse(socket.handshake.query.teamsStr)
        teams.map( t => socket.join(t))

        socket.on('project-update', async (project) => {
            console.log(username, 'project-update');
            const updatedProject = await sockets.projectUpdate(project._id)
            socket.broadcast.emit('project-updated', updatedProject)
            socket.emit('project-updated', updatedProject)
        })

        socket.on('team-update', async (teamId) => {
            console.log(username, 'team-update');
            const updatedTeam = await sockets.teamUpdate(teamId)
            socket.to(teamId).emit('team-updated', updatedTeam)
            socket.emit('team-updated', updatedTeam)
        })
    })

    server.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}!`))

}).catch(console.error)
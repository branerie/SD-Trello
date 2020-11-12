const config = require('./config/config')
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

        console.log('connected');
        const user = socket.handshake.query.user
        socket.join(user)
        console.log(user);

        socket.on('project-update', async (project) => {
            console.log('project-update');
            const updatedProject = await sockets.projectUpdate(project._id)
            project.membersRoles.forEach(member => {

                socket.broadcast.to(member.memberId.username).emit('project-updated', updatedProject)
            })
        })
    })

    server.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}!`))

}).catch(console.error)
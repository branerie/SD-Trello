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

    io.on('connection', socket => sockets(socket))


    server.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}!`))

}).catch(console.error)
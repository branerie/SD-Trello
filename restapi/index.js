const config = require('./config/config')
const http = require("http")
const dbConnection = require('./config/database')
const socketIo = require("socket.io")
const dotEnv = require("dotenv")
dotEnv.config()

require('express-async-errors')
const app = require('express')()

dbConnection().then(() => {

    require('./config/express')(app)
    
    const server = app.listen(config.port, console.log(`Listening on port ${config.port}!`))

    const io = socketIo(server)

    io.use((socket, next) => {
        let clientId = socket.handshake.headers['x-clientid'];
        if (isValid(clientId)) {
          return next();
        }
        return next(new Error('authentication error'));
      });

    let interval;

    io.on("connection", (socket) => {
        console.log("New client connected");
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => getApiAndEmit(socket), 1000);
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            clearInterval(interval);
        });
    });

    const getApiAndEmit = socket => {
        const response = new Date();
        // Emitting a new message. Will be consumed by the client
        socket.emit("FromAPI", response);
    };

}).catch(console.error)
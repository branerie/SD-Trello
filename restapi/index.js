const config = require('./config/config')
const dbConnection = require('./config/database')
const dotEnv = require("dotenv")
dotEnv.config()

require('express-async-errors')
const app = require('express')()

dbConnection().then(() => {

    require('./config/express')(app)

    app.listen(config.port, console.log(`Listening on port ${config.port}!`))

}).catch(console.error)
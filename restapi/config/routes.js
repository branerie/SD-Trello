const controllers = require('../controllers/');

module.exports = (app) => {

    app.use('/api/user', controllers.user)

    app.use('/api/projects', controllers.project)

    app.use('/api/projects/lists', controllers.list)

    app.use('/api/projects/lists/cards', controllers.card)

    app.use('*', (req, res, next) => res.send('<h1> Something went wrong. Try again. :thumbsup: </h1>'))
}


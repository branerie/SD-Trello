const router = require('../routes/');
const controllers = require('../controllers/');


module.exports = (app) => {

    app.use('/api/user', controllers.user);

    app.use('/api/projects', router.project);

    app.use('*', (req, res, next) => res.send('<h1> Something went wrong. Try again. :thumbsup: </h1>'))
};




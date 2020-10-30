const router = require('../routes/');
const controllers = require('../controllers/');


module.exports = (app) => {

    app.use('/api/user', controllers.user);

    app.use('/api/projects', controllers.project);

    app.use('*', (req, res, next) => res.send('<h1> Something went wrong. Try again. :thumbsup: </h1>'))
};



const controllers = require('../controllers/');
const router = require('express').Router();

router.get('/', controllers.user.get);

router.post('/register', controllers.user.post.register);

router.post('/login', controllers.user.post.login);

// router.get('/verify', controllers.user.post.verifyLogin);

router.post('/logout', controllers.user.post.logout);

router.put('/:id', controllers.user.put);

router.delete('/:id', controllers.user.delete);

module.exports = router;











































const controllers = require('../controllers');
const router = require('express').Router();
const { auth, isAdmin } = require('../utils');

router.get('/:id/lists', auth(), controllers.list.get);

router.post('/:id/lists', auth(), isAdmin(), controllers.list.post);

// router.put('/:id/lists/:id-list', auth(), controllers.project.put);

// router.delete('/:id/list/:id-list', auth(), controllers.project.delete);

// router.post('/:id/lists/:id-list/cards', auth(), controllers.card.post);

// router.put('/:id/lists/:id-list/cards/:id-card', auth(), controllers.card.put);

// router.delete('/:id/list/:id-list/card/:id-card', auth(), controllers.project.delete);

router.get('/', auth(), controllers.project.get);

router.post('/', auth(), controllers.project.post);

// router.put('/:id', auth(), controllers.project.put);

// router.delete('/:id', auth(), controllers.project.delete);

module.exports = router;
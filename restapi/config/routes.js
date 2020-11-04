const controllers = require('../controllers/');

module.exports = (app) => {

    app.use('/api/user', controllers.user)

    app.use('/api/projects', controllers.project)

    app.use('/api/projects/lists', controllers.list)

    app.use('/api/projects/lists/cards', controllers.card)


    // app.use('/api/projects/:id/lists/:id/cards', controllers.card);

    app.use('*', (req, res, next) => res.send('<h1> Something went wrong. Try again. :thumbsup: </h1>'))
};



// router.get('/:id/lists', auth(), controllers.list.get);

// router.post('/:id/lists', auth(), isAdmin(), controllers.list.post);

// router.put('/:id/lists/:id-list', auth(), controllers.project.put);

// router.delete('/:id/list/:id-list', auth(), controllers.project.delete);

// router.post('/:id/lists/:id-list/cards', auth(), controllers.card.post);

// router.put('/:id/lists/:id-list/cards/:id-card', auth(), controllers.card.put);

// router.delete('/:id/list/:id-list/card/:id-card', auth(), controllers.project.delete);

// router.get('/', auth, controllers.project.get);

// router.post('/', auth, controllers.project.post);

// router.post('/:id/user', auth, isAdmin, controllers.project.add);

// router.put('/:id', auth(), controllers.project.put);

// router.delete('/:id', auth(), controllers.project.delete);
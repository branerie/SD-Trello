const controllers = require('../controllers');
const router = require('express').Router();
const { auth, isAdmin } = require('../utils');

// router.get('/:id/lists', auth(), controllers.list.get);

// router.post('/:id/lists', auth(), isAdmin(), controllers.list.post);

// router.put('/:id/lists/:id-list', auth(), controllers.project.put);

// router.delete('/:id/list/:id-list', auth(), controllers.project.delete);

// router.post('/:id/lists/:id-list/cards', auth(), controllers.card.post);

// router.put('/:id/lists/:id-list/cards/:id-card', auth(), controllers.card.put);

// router.delete('/:id/list/:id-list/card/:id-card', auth(), controllers.project.delete);

router.get('/', auth, controllers.project.get);

router.post('/', auth, controllers.project.post);

router.post('/:id/user', auth, isAdmin, controllers.project.add);

// router.put('/:id', auth(), controllers.project.put);

// router.delete('/:id', auth(), controllers.project.delete);

module.exports = router;
const controllers = require('../controllers');
const router = require('express').Router();
const { auth } = require('../utils');

router.get('/', auth(), controllers.project.get);

router.post('/', auth(), controllers.project.post);

router.put('/:id', auth(), controllers.project.put);

router.delete('/:id', auth(), controllers.project.delete);

module.exports = router;
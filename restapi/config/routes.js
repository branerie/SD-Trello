const controllers = require('../controllers/');
const router = require('express').Router()


router.use('/api/user', controllers.user)

router.use('/api/projects', controllers.project)

router.use('/api/projects/lists', controllers.list)

router.use('/api/projects/lists/cards', controllers.card)

router.use('/api/teams', controllers.team)

router.use('*', (req, res, next) => res.send('<h1> Something went wrong. Try again. :thumbsup: </h1>'))

module.exports = router


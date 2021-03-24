const controllers = require('../controllers/')
const router = require('express').Router()


router.use('/user', controllers.user)

router.use('/projects', controllers.project)

router.use('/projects/lists', controllers.list)

router.use('/projects/lists/cards', controllers.card)

router.use('/teams', controllers.team)

router.use('*', (req, res, ) => res.send('<h1> Something went wrong. Try again. :thumbsup: </h1>'))

module.exports = router
const mongoose = require('mongoose')
const models = require('../models')
const config = require('../config/config')
const utils = require('../utils')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const googleAuth = require('../utils/googleAuth')
const { auth, isAdmin } = require('../utils')
const { decode } = require('jsonwebtoken')
const getTeams = require('../utils/getTeams')


router.get('/verify', verifyLogin);

router.get('/get-all', auth, getAllUsers);

router.get('/:id', getUser)

router.get('/tasks/:teamid', auth, getUserTasks)

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/google-login', googleLoginUser)

router.post('/logout', logoutUser)

router.post('/confirmation', confirmToken)

router.put('/:id', updateUser)

router.put('/recentProjects/:id', updateUserRecentProjects)

router.delete('/:id', deleteUser)


async function getUser(req, res, next) {
    const user = await models.User.findById(req.params.id)
    res.send(user);
}

async function getAllUsers(req, res, next) {
    const users = await models.User.find({})
    res.send(users);
}

async function registerUser(req, res, next) {
    const { email, username, password } = req.body;
    if (!password) {
        res.send("Missing password")
        return
    }

    models.User.findOne({ email }, async function (err, user) {

        if (user === null) {
            const newUser = new models.User({ email, username, password, confirmed: false })
            newUser.setConfirmationToken()
            const createdUser = await newUser.save()

            const token = utils.jwt.createToken({ id: createdUser._id })

            const teams = await getTeams(createdUser._id)
            const response = {
                user: createdUser,
                teams
            }
            utils.sendConfirmationEmail(newUser)
            res.header("Authorization", token).send(response)
            return
        }
        let userExist = {}
        userExist.error = true
        userExist.exist = true
        res.send(userExist)

        if (err) {
            console.log(err);
        }
    })
}

function verifyLogin(req, res, next) {

    const token = req.headers.authorization || '';

    Promise.all([
        utils.jwt.verifyToken(token),
        models.TokenBlacklist.findOne({ token })
    ])
        .then(([data, blacklistToken]) => {

            if (blacklistToken) { return Promise.reject(new Error('blacklisted token')) }
            models.User.findById(data.id)
                .then(async (user) => {
                    const teams = await getTeams(user._id)
                    return res.send({
                        status: true,
                        user,
                        teams
                    })
                });
        })
        .catch(err => {
            if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
                res.status(401).send('UNAUTHORIZED!');
                return;
            }

            res.send({
                status: false
            })
        })
}

async function loginUser(req, res, next) {
    const { email, password } = req.body

    try {
        const user = await models.User.findOne({ email })


        if (!user) {
            let response = {}
            response.wrongUser = true
            res.send(response)
            return;
        }

        if (!user.password) {
            let response = {}
            response.needPassword = true
            response.userId = user._id
            res.send(response)
        }
        const match = await user.matchPassword(password)

        if (!match) {
            let response = {}
            response.wrongPassword = true
            res.send(response)
            return;
        }

        const token = utils.jwt.createToken({ id: user._id })

        const teams = await getTeams(user._id)
        const response = {
            user,
            teams
        }
        res.header("Authorization", token).send(response)

    } catch (error) {
        console.log(error)
    }
}

async function googleLoginUser(req, res, next) {
    const { tokenId } = req.body
    const { email, username, imageUrl, email_verified } = await googleAuth(tokenId)
    if (!email_verified) {
        res.send('Google verification failed')
        return
    }

    try {
        let user = await models.User.findOne({ email })
        if (user === null) {
            user = await models.User.create({ email, username, imageUrl })
        }

        const token = utils.jwt.createToken({ id: user._id })

        const teams = await getTeams(user._id)
        
        const response = {
            user,
            teams
        }
        res.header("Authorization", token).send(response)

    } catch (error) {
        console.log(error)
    }
}

async function logoutUser(req, res, next) {
    const token = req.headers.authorization
    const { exp } = decode(token)
    await models.TokenBlacklist.create({ token, expirationDate: exp * 1000 })
    res.clearCookie(config.authCookieName).send('Logout successfully!')
}

async function confirmToken(req, res, next) {
    const { token } = req.body

    try {
        const user = await models.User.findOneAndUpdate({ confirmationToken: token }, { confirmationToken: '', confirmed: true }, { new: true })

        res.send(user)
    } catch (error) {
        console.log(error)
    }
}

async function updateUser(req, res, next) {
    const id = req.params.id
    let user = { username, password, email, imageUrl } = req.body
    const obj = {}
    for (let key in user) {
        if (user[key] && key !== 'password') {
            obj[key] = user[key]
        }
    }

    if (password) {
        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) { next(err); return }

                const result = await models.User.updateOne({ _id: id }, { ...obj, password: hash })
                const updatedUser = await models.User.findOne({ _id: id })
                const teams = await getTeams(updatedUser._id)
                const response = {
                    user: updatedUser,
                    teams
                }
                res.send(response)
                return
            })
        })
    } else {
        const result = await models.User.updateOne({ _id: id }, obj)
        const updatedUser = await models.User.findOne({ _id: id })
        const teams = await getTeams(updatedUser._id)
        const response = {
            user: updatedUser,
            teams
        }
        res.send(response)
    }
}

async function updateUserRecentProjects(req, res, next) {
    const id = req.params.id
    const { recentProjects } = req.body


    const result = await models.User.updateOne({ _id: id }, {recentProjects})
    const updatedUser = await models.User.findOne({ _id: id })
    const teams = await getTeams(updatedUser._id)
    const response = {
        user: updatedUser,
        teams
    }
    res.send(response)

}

async function deleteUser(req, res, next) {
    const id = req.params.id;

    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        const removedUser = await models.User.deleteOne({ _id: id }).session(session);
        const userProjectsRoles = await models.ProjectUserRole.find({ memberId: id }).session(session);
        await models.Project.updateMany({ _id: { $in: userProjectsRoles.projectId } }, { $pull: { membersRoles: userProjectsRoles._id } }).session(session);
        await models.Project.deleteMany({ author: id }).session(session);
        await models.ProjectUserRole.deleteMany({ memberId: id }).session(session);

        await session.commitTransaction();

        session.endSession();

        res.send(removedUser);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.send(error);
    }

}

async function getUserTasks(req, res, next) {
    const userId = req.user._id
    const teamId = req.params.teamid
    const team = await models.Team.findOne({ _id: teamId })
        .populate({
            path: 'projects',
            populate: {
                path: 'lists',
                populate: {
                    path: 'cards',
                    populate: {
                        path: 'members'
                    }
                }
            }
        })

    let projects = team.projects
    
    projects.forEach(p => p.lists.forEach(l => l.cards = l.cards.filter(c => {
        const isMembers = c.members.some(m => m._id.toString() === userId.toString())
        return isMembers
    })))
    projects.forEach(p => p.lists = p.lists.filter(l => l.cards.length !== 0))
    projects = projects.filter(p => p.lists.length !== 0)
    res.send(projects)
}

module.exports = router
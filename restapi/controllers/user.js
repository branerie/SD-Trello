const mongoose = require('mongoose')
const models = require('../models')
const config = require('../config/config')
const utils = require('../utils')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const { auth, userInbox, googleAuth } = require('../utils')
const { decode } = require('jsonwebtoken')
const getTeams = require('../utils/getTeams')
const cloudinary = require('../utils/cloudinary')


router.get('/verify', verifyLogin)

router.get('/get-all', auth, getAllUsers)

router.get('/inbox', auth, getUserInbox)

router.get('/:id', getUser)

router.get('/tasks/:teamid', auth, getUserTasks)

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/google-login', googleLoginUser)

router.post('/logout', logoutUser)

router.post('/confirmation', confirmToken)

router.post('/inbox', auth, moveMessageToHistory)

router.put('/:id', auth, updateUser)

router.put('/password/:id', auth, updateUserPassword)

router.put('/addNewPassword/:id', updateUserPassword)

router.put('/image/:id', auth, updateUserImage)

router.put('/recentProjects/:id', auth, updateUserRecentProjects)

router.delete('/message/:messageid', auth, deleteUserMessage)

router.delete('/:id', deleteUser)


async function getUser(req, res) {
    const user = await models.User.findById(req.params.id)
    res.send(user)
}

async function getAllUsers(req, res) {
    const users = await models.User.find({}).select('-password')
    res.send(users)
}

async function registerUser(req, res) {
    const { email, username, password } = req.body
    if (!password) {
        res.send('Missing password')
        return
    }


    models.User.findOne({ email }, async (err, user) => {
        if (user !== null) {
            const userExist = {}
            userExist.error = true
            userExist.exist = true
            res.send(userExist)
            return
        }

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
            await utils.sendConfirmationEmail(newUser, 'account')
            res.header('Authorization', token).send(response)
            return
        }


        if (err) {
            console.log(err)
        }
    })
}

function verifyLogin(req, res) {

    const token = req.headers.authorization || ''

    Promise.all([
        utils.jwt.verifyToken(token),
        models.TokenBlacklist.findOne({ token })
    ])
        .then(([data, blacklistToken]) => {

            if (blacklistToken) {
                return Promise.reject(new Error('blacklisted token'))
            }

            models.User.findById(data.id).select('-password')
                .then(async (user) => {
                    const teams = await getTeams(user._id)
                    return res.send({
                        status: true,
                        user,
                        teams
                    })
                })
        })
        .catch(err => {
            if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
                res.status(401).send('UNAUTHORIZED!')
                return
            }

            res.send({
                status: false
            })
        })
}

async function loginUser(req, res) {
    const { email, password } = req.body

    try {
        const foundUser = await models.User.findOne({ email })


        if (!foundUser) {
            const response = {}
            response.wrongUser = true
            res.send(response)
            return
        }

        const token = utils.jwt.createToken({ id: foundUser._id })

        if (!foundUser.password) {
            const response = {}
            response.needPassword = true
            response.userId = foundUser._id
            res.header('Authorization', token).send(response)

            return
        }

        const match = await foundUser.matchPassword(password)

        if (!match) {
            const response = {}
            response.wrongPassword = true
            response.userId = foundUser._id
            res.header('Authorization', token).send(response)

            return
        }

        const user = await models.User.findOne({ email }).select('-password')
        const teams = await getTeams(user._id)
        const response = {
            user,
            teams
        }
        res.header('Authorization', token).send(response)

    } catch (error) {
        console.log(error)
    }
}

async function googleLoginUser(req, res) {
    const { tokenId } = req.body
    const { email, username, image, email_verified } = await googleAuth(tokenId)
    if (!email_verified) {
        res.send('Google verification failed')
        return
    }

    try {
        let user = await models.User.findOne({ email }).select('-password')
        if (user === null) {
            user = await models.User.create({ email, username, image })
        }

        const token = utils.jwt.createToken({ id: user._id })

        const teams = await getTeams(user._id)

        const response = {
            user,
            teams
        }
        res.header('Authorization', token).send(response)

    } catch (error) {
        console.log(error)
    }
}

async function logoutUser(req, res) {
    const token = req.headers.authorization
    const { exp } = decode(token)
    await models.TokenBlacklist.create({ token, expirationDate: exp * 1000 })
    res.clearCookie(config.authCookieName).send('Logout successfully!')
}

async function confirmToken(req, res) {
    const { token } = req.body

    try {
        const foundUser = await models.User.findOne({ confirmationToken: token })
        let user

        if (foundUser.confirmed) {
            user = await models.User.findOneAndUpdate(
                { confirmationToken: token },
                { confirmationToken: '', password: foundUser.newPassword, newPassword: '', newPasswordConfirmed: true },
                { new: true }
            ).select('-password')
        } else {
            user = await models.User.findOneAndUpdate(
                { confirmationToken: token },
                { confirmationToken: '', confirmed: true },
                { new: true }
            ).select('-password')
        }

        const newToken = utils.jwt.createToken({ id: user._id })
        const teams = await getTeams(user._id)
        const response = {
            user,
            teams
        }
        res.header('Authorization', newToken).send(response)

    } catch (error) {
        console.log(error)
    }

}

async function updateUser(req, res) {
    const { id } = req.params
    const user = req.body

    await models.User.updateOne({ _id: id }, user)
    const updatedUser = await models.User.findOne({ _id: id }).select('-password')
    const teams = await getTeams(updatedUser._id)
    const response = {
        user: updatedUser,
        teams
    }
    res.send(response)
}

async function updateUserPassword(req, res, next) {
    const { id } = req.params
    const { password } = req.body

    await bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                next(err)
                return
            }

            const updatedUser = await models.User.findOneAndUpdate(
                { _id: id },
                { newPassword: hash, newPasswordConfirmed: false },
                { new: true }
            ).select('-password')

            updatedUser.setConfirmationToken()
            await updatedUser.save()

            const teams = await getTeams(updatedUser._id)
            const response = {
                user: updatedUser,
                teams
            }

            await utils.sendConfirmationEmail(updatedUser, 'pass')

            res.send(response)
            return
        })
    })

}

async function updateUserImage(req, res) {
    const { id } = req.params
    const { newImage, oldImage } = req.body


    if (newImage) {
        await models.User.updateOne({ _id: id }, { image: newImage })
    } else {
        await models.User.updateOne({ _id: id }, { image: undefined })
    }

    if (oldImage) {
        cloudinary.api.delete_resources([oldImage.publicId], (error) => console.log(error))
    }

    const updatedUser = await models.User.findOne({ _id: id }).select('-password')
    const teams = await getTeams(updatedUser._id)
    const response = {
        user: updatedUser,
        teams
    }
    res.send(response)
}

async function updateUserRecentProjects(req, res) {
    const { id } = req.params
    const { recentProjects } = req.body

    await models.User.updateOne({ _id: id }, { recentProjects })
    const updatedUser = await models.User.findOne({ _id: id }).select('-password')
    const teams = await getTeams(updatedUser._id)
    const response = {
        user: updatedUser,
        teams
    }
    res.send(response)

}

async function deleteUser(req, res) {
    const { id } = req.params

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const removedUser = await models.User.deleteOne({ _id: id }).session(session)
        const userProjectsRoles = await models.ProjectUserRole.find({ memberId: id })
        await models.Project.updateMany(
            { _id: { $in: userProjectsRoles.projectId } },
            { $pull: { membersRoles: userProjectsRoles._id } }
        ).session(session)
        await models.Project.deleteMany({ author: id }).session(session)
        await models.ProjectUserRole.deleteMany({ memberId: id }).session(session)

        await session.commitTransaction()

        session.endSession()

        res.send(removedUser)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }

}

async function getUserTasks(req, res) {
    const userId = req.user._id
    const teamId = req.params.teamid
    const team = await models.Team.findById(teamId)
        .populate({
            path: 'projects',
            populate: [{
                path: 'lists',
                populate: {
                    path: 'cards',
                    populate: {
                        path: 'members',
                        select: '-password'
                    }
                }
            }, {
                path: 'membersRoles',
                populate: {
                    path: 'memberId',
                    select: '-password'
                }
            }]
        })

    if (team === null) {
        res.send('Team not found')
        return
    }

    await models.User.updateOne({ _id: userId }, { lastTeamSelected: teamId })
    let { projects } = team

    projects.forEach(p => p.lists.forEach(l => l.cards = l.cards.filter(c => {
        const isMembers = c.members.some(m => m._id.toString() === userId.toString())
        return isMembers
    })))
    projects.forEach(p => p.lists = p.lists.filter(l => l.cards.length !== 0))
    projects = projects.filter(p => p.lists.length !== 0)
    res.send(projects)
}

async function getUserInbox(req, res) {
    try {
        const userId = req.user._id
        const user = await userInbox(userId)
        res.send(user)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

async function deleteUserMessage(req, res) {
    const userId = req.user._id
    const messageId = req.params.messageid
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await models.User.updateOne({ _id: userId }, { $pull: { inboxHistory: messageId } }).session(session)
        const message = await models.Message.findOneAndUpdate({ _id: messageId }, { $pull: { recievers: userId } }, { new: true }).session(session)

        if (message.recievers.length === 0) {
            await models.Message.deleteOne({ _id: messageId }).session(session)
        }

        await session.commitTransaction()

        session.endSession()

        const user = await userInbox(userId)

        res.send(user)
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        console.log(err)
        res.send(err)
    }
}

async function moveMessageToHistory(req, res) {
    const userId = req.user._id
    const { message } = req.body

    try {
        await models.User.updateOne({ _id: userId }, { $pull: { inbox: message._id }, $push: { inboxHistory: message } })

        const user = await userInbox(userId)

        res.send(user)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

module.exports = router
const mongoose = require('mongoose')
const models = require('../models')
const { auth, userInbox } = require('../utils')
const router = require('express').Router()
const getTeams = require('../utils/getTeams')

router.post('/invitations/:id', auth, teamInvitations)

router.post('/', auth, createTeam)

router.get('/get-users/:id', auth, getTeamUsers)

router.get('/:teamid', auth, getTeamInvitationInfo)

router.get('/', auth, getUserTeams)

router.put('/:id', auth, updateTeam)

router.delete('/:id', auth, deleteTeam)


async function teamInvitations(req, res, next) {
    const userId = req.user._id
    const teamId = req.params.id
    const { message, accepted } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        if (message.recievers.length === 1) {
            await models.Message.deleteOne({ _id: message._id }).session(session)
        } else {
            await models.Message.updateOne({ _id: message._id }, { $pull: { recievers: userId } }).session(session)
        }

        const team = await models.Team.findOne({ _id: teamId })
        const teamObj = { name: team.name, id: team._id }
        const messageCreationResult = await models.Message.create([{ subject: 'Team invitation', team: teamObj, sendFrom: message.sendFrom, recievers: [userId], accepted }], { session })
        const createdMessage = messageCreationResult[0]
        await models.User.updateOne({ _id: userId }, { $pull: { inbox: message._id }, $push: { inboxHistory: createdMessage } }).session(session)

        const responseMessageCreationResult = await models.Message.create([{ subject: 'Team invitation response', team: teamObj, sendFrom: userId, recievers: [message.sendFrom._id], accepted }], { session })
        const createdResponseMessage = responseMessageCreationResult[0]
        await models.User.updateOne({ _id: message.sendFrom._id }, { $push: { inbox: createdResponseMessage } }).session(session)

        if (accepted) {
            await models.Team.updateOne({ _id: teamId }, { $pull: { requests: userId }, $push: { members: userId } }).session(session)
        } else {
            await models.Team.updateOne({ _id: teamId }, { $pull: { requests: userId } }).session(session)
        }

        await session.commitTransaction()

        session.endSession()
        const user = await userInbox(userId)

        res.send(user)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }
}

async function createTeam(req, res, next) {
    const userId = req.user._id
    const { name, description, requests } = req.body
    const members = [userId]
    const requestsId = requests.map(r => r._id)

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        const teamCreationResult = await models.Team.create([{ name, description, author: userId, members, requests }], { session })
        const createdTeam = teamCreationResult[0]
        const teamObj = { name: createdTeam.name, id: createdTeam._id }

        if (requestsId) {
            const messageCreationResult = await models.Message.create([{ subject: 'Team invitation', team: teamObj, sendFrom: userId, recievers: requestsId }], { session })
            const createdMessage = messageCreationResult[0]

            await models.User.updateMany({ _id: { $in: requestsId } }, { $push: { inbox: createdMessage } }, { session })
        }

        await session.commitTransaction()
        session.endSession()

        res.send(createdTeam)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }
}

async function getUserTeams(req, res, next) {
    const { _id } = req.user

    try {
        const user = await models.User.findOne({ _id: _id }).select('-password')
        const teams = await getTeams(_id)

        const response = {
            user,
            teams
        }
        res.send(response)

    } catch (error) {
        console.log(error)
    }
}

async function getTeamInvitationInfo(req, res, next) {
    const teamId = req.params.teamid

    try {
        const team = await models.Team.findOne({ _id: teamId })
            .populate({
                path: 'members',
                select: '-password'
            })
            .populate({
                path: 'requests'
            })

            res.send(team)
    } catch (error) {
        console.log(error)
    }
}

async function getTeamUsers(req, res, next) {
    const teamId = req.params.id

    try {
        const team = await models.Team.findOne({ _id: teamId })
            .populate({
                path: 'members',
                select: '-password'
            })
            .populate({
                path: 'requests'
            })

        res.send(team)

    } catch (error) {
        console.log(error);
    }
}

async function updateTeam(req, res, next) {

    const teamId = req.params.id
    const { name, description, members, requests, removeInvitation } = req.body
    
    const team = { name, description, members }
    const obj = {}
    for (let key in team) {
        if (team[key]) {
            obj[key] = team[key]
        }
    }

    if (removeInvitation) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            const userForRemove = removeInvitation._id

            const updatedTeam = await models.Team.findOneAndUpdate({ _id: teamId }, { $pull: { requests: userForRemove } }, { new: true }).session(session)
            const teamObj = { name: updatedTeam.name, id: teamId }

            const oldMessage = await models.Message.findOneAndUpdate({ 'team.id': teamId, recievers: { '$in': [userForRemove] } }, { $pull: { recievers: userForRemove } }, { new: true }).session(session)

            const messageCreationResult = await models.Message.create([{ subject: 'Team invitation canceled', team: teamObj, sendFrom: req.user._id, recievers: [userForRemove] }], { session })
            const createdMessage = messageCreationResult[0]

            await models.User.updateOne({ _id: userForRemove }, { $pull: { inbox: oldMessage.id } }).session(session)
            await models.User.updateOne({ _id: userForRemove }, { $push: { inbox: createdMessage } }).session(session)

            await session.commitTransaction()

            session.endSession()
            res.send('Success')
            return
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            res.send(error)
            return
        }
    }

    if (requests) {
        const requestsId = requests.map(r => r._id)

        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            const teamEditResult = await models.Team.findOneAndUpdate({ _id: teamId }, { ...obj, $push: { requests: { $each: requestsId } } }, { new: true }).session(session)
            const teamObj = { name: teamEditResult.name, id: teamId }

            const messageCreationResult = await models.Message.create([{ subject: 'Team invitation', team: teamObj, sendFrom: req.user._id, recievers: requestsId }], { session })
            const createdMessage = messageCreationResult[0]

            await models.User.updateMany({ _id: { $in: requestsId } }, { $push: { inbox: createdMessage } }, { session })

            await session.commitTransaction()

            session.endSession()
            res.send(teamEditResult)
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            res.send(error)
        }
    } else {

        await models.Team.updateOne({ _id: teamId }, { ...obj })
        const updatedTeam = await models.Team.findOne({ _id: teamId })
        res.send(updatedTeam)
    }

}

async function deleteTeam(req, res, next) {
    const userId = req.user._id
    const idTeam = req.params.id
    const session = await mongoose.startSession()
    session.startTransaction()
    const teamForDelete = await models.Team.findOne({ _id: idTeam }).populate('projects')
    const { members, requests } = teamForDelete

    try {

        for (let project of teamForDelete.projects) {
            const idProject = project._id
    
            const searchedLists = await models.Project.findOne({ _id: idProject }).select('lists -_id').populate('lists')
    
            let cardsArray = []
            searchedLists.lists.map(a => cardsArray = cardsArray.concat(a.cards))
    
            await models.Card.deleteMany({ _id: { $in: cardsArray } }).session(session)
    
            let listsArray = []
            searchedLists.lists.map(a => listsArray.push(a._id))
    
    
            await models.List.deleteMany({ _id: { $in: listsArray } }).session(session)
    
            const projectUserRoles = await models.Project.findOne({ _id: idProject }).select('membersRoles -_id')
    
            const membersArr = await models.ProjectUserRole.find({ _id: { $in: projectUserRoles.membersRoles } }).select('memberId')
    
            for (let element of membersArr) {
                await models.User.updateOne({ _id: element.memberId }, { $pull: { projects: element._id } }).session(session)
                await models.ProjectUserRole.deleteOne({ _id: element._id }).session(session)
            }
    
            await models.Project.deleteOne({ _id: idProject }).session(session)
        }

        const teamObj = { name: teamForDelete.name, id: idTeam, isDeleted: true }
        const messages = await models.Message.find({ 'team.id': idTeam })

        for (let m of messages) {
            await models.Message.updateOne({ _id: m._id }, { team: teamObj }).session(session)
        }

        const messageCreationResult = await models.Message.create([{ subject: 'Team deleted', team: teamObj, sendFrom: userId, recievers: members }], { session })
        const createdMessage = messageCreationResult[0]

        await models.User.updateMany({ _id: { $in: members } }, { $push: { inbox: createdMessage } }, { session })

        await models.Team.deleteOne({ _id: idTeam }).session(session)

        const test = await models.User.updateMany({ lastTeamSelected: idTeam }, { lastTeamSelected: '' }).session(session)

        await session.commitTransaction()

        session.endSession()

        res.send({ members, requests })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }

}

module.exports = router;
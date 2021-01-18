const mongoose = require('mongoose')
const models = require('../models')
const { auth } = require('../utils')
const router = require('express').Router()

router.post('/invitations/:id', auth, teamInvitations)

router.post('/', auth, createTeam)

router.get('/get-users/:id', auth, getTeamUsers)

router.get('/', auth, getTeams)

router.put('/:id', auth, updateTeam)

router.delete('/:id', auth, deleteTeam)


async function teamInvitations(req, res, next) {
    const userId = req.user._id
    const teamId = req.params.id
    const { message, accepted } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        await models.Message.updateOne({ _id: message._id }, { $pull: { recievers: userId } }).session(session)

        const messageCreationResult = await models.Message.create([{ subject: 'Team invitation', team: teamId, invitedBy: message.invitedBy, newMessage: false, recievers: [userId], accepted }], { session })
        const createdMessage = messageCreationResult[0]
        await models.User.updateOne({ _id: userId }, { $pull: { inbox: message._id }, $push: { inboxHistory: createdMessage } }).session(session)

        if (accepted) {
            await models.Team.updateOne({ _id: teamId }, { $pull: { requests: userId }, $push: { members: userId } }).session(session)
        } else {
            await models.Team.updateOne({ _id: teamId }, { $pull: { requests: userId } }).session(session)
        }
        
        await session.commitTransaction()

        session.endSession()

        res.send('Team invitation handled')
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

        if (requestsId) {
            const messageCreationResult = await models.Message.create([{ subject: 'Team invitation', team: createdTeam, invitedBy: userId, newMessage: true, recievers: requestsId }], { session })
            const createdMessage = messageCreationResult[0]
    
            await models.User.updateMany({ _id: { $in: requestsId } }, { $push: { inbox: createdMessage } }, { session })
        }

        await session.commitTransaction()
        session.endSession()

        res.send(createdTeam)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.log(error);
        res.send(error)
    }
}

async function getTeams(req, res, next) {
    const { _id } = req.user

    try {
        const teams = await models.Team.find({ members: _id })
            .populate({
                path: 'projects',
                populate: {
                    path: 'membersRoles',
                    populate: {
                        path: 'memberId'
                    }
                }
            })
            .populate({
                path: 'projects',
                populate: {
                    path: 'author'
                }
            })
            .populate({
                path: 'members'
            })    
            .populate({
                path: 'requests'
            })    
        res.send(teams)

    } catch (error) {
        console.log(error);
    }
}

async function getTeamUsers(req, res, next) {
    const teamId = req.params.id

    try {
        const team = await models.Team.findOne({ _id: teamId })
            .populate({
                path: 'members'
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
            await models.Team.updateOne({ _id: teamId }, { $pull: { requests: userForRemove } }).session(session)

            const oldMessage = await models.Message.findOneAndUpdate({ team: teamId, recievers: { "$in" : [userForRemove]} }, { $pull: { recievers: userForRemove } }, { new: true }).session(session)

            const messageCreationResult = await models.Message.create([{ subject: 'Team invitation', team: teamId, invitedBy: req.user._id, newMessage: false, recievers: [userForRemove], canceled: true }], { session })
            const createdMessage = messageCreationResult[0]

            await models.User.updateOne({ _id: userForRemove }, { $pull: { inbox: oldMessage._id }, $push: { inboxHistory: createdMessage } }).session(session)

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

            const teamEditResult = await models.Team.updateOne({ _id: teamId }, { ...obj, $push: { requests: { $each: requestsId } } }).session(session)

            const messageCreationResult = await models.Message.create([{ subject: 'Team invitation', team: teamId, invitedBy: req.user._id, newMessage: true, recievers: requestsId }], { session })
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
    // const idCard = req.params.idcard
    // const idList = req.params.id
    // const session = await mongoose.startSession();
    // session.startTransaction();

    // try {
    //     const removedCardResult = await models.Card.deleteOne({ _id: idCard }).session(session)

    //     removedCard = removedCardResult

    //     await models.List.updateOne({ _id: idList }, { $pull: { cards: idCard } }).session(session)

    //     await session.commitTransaction();

    //     session.endSession();

    //     res.send(removedCard)
    // } catch (error) {
    //     await session.abortTransaction();
    //     session.endSession();
    //     res.send(error);
    // }

}

module.exports = router;
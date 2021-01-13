const mongoose = require('mongoose')
const models = require('../models')
const { v4: uuidv4 } = require('uuid');
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
    const { messageId, accepted, teamName } = req.body
    const message = JSON.stringify({ id: messageId, subject: 'Team invitation', teamId, teamName })


    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        if (accepted) {
            await models.Team.updateOne({ _id: teamId }, { $pull: { requests: userId }, $push: { members: userId } }).session(session)
            await models.User.updateOne({ _id: userId }, { $pull: { inbox: message } }).session(session)
        } else {
            await models.Team.updateOne({ _id: teamId }, { $pull: { requests: userId } }).session(session)
            await models.User.updateOne({ _id: userId }, { $pull: { inbox: message } }).session(session)
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

        const message = JSON.stringify({ id: uuidv4(), subject: 'Team invitation', teamId: createdTeam._id, teamName: name })

        await models.User.update({ _id: { $in: requestsId } }, { $push: { inbox: message } }, { session })

        await session.commitTransaction()

        session.endSession()

        res.send(createdTeam)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
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
    
    
    if (removeInvitation) {
        const userForRemove = removeInvitation._id
        await models.Team.updateOne({ _id: teamId }, { $pull: { requests: userForRemove } })
        const updatedTeam = await models.Team.findOne({ _id: teamId })
        res.send(updatedTeam)
        return
    }

    if (requests) {
        const requestsId = requests.map(r => r._id)

        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            const teamEditResult = await models.Team.updateOne({ _id: teamId }, { name, description, members, $push: { requests: { $each: requestsId } } }).session(session)

            const message = JSON.stringify({ id: uuidv4(), subject: 'Team invitation', teamId: teamId, teamName: name })

            await models.User.updateMany({ _id: { $in: requestsId } }, { $push: { inbox: message } }, { session })

            await session.commitTransaction()

            session.endSession()
            res.send(teamEditResult)
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            res.send(error)
        }
    } else {

        const team = { name: name, description: description, members: members }
        const obj = {}
        for (let key in team) {
            if (team[key]) {
                obj[key] = team[key]
            }
        }
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
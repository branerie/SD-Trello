const models = require('../models')
const { auth } = require('../utils')
const router = require('express').Router()

router.post('/', auth, createTeam)

router.get('/get-users/:id', auth, getTeamUsers)

router.get('/', auth, getTeams)

router.put('/:id', auth, updateTeam)

router.delete('/:id', auth, deleteTeam)


async function createTeam(req, res, next) {
    const userId = req.user._id
    const { name, description, members } = req.body
    members.push(userId)

    const createdTeam = await models.Team.create({ name, description, author: userId, members })

    res.send(createdTeam)
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
            
        res.send(team.members)

    } catch (error) {
        console.log(error);
    }
}

async function updateTeam(req, res, next) {
    const teamId = req.params.id
    const team = { name, description, members } = req.body;
    const obj = {}
    for (let key in team) {
        if (team[key]) {
            obj[key] = team[key]
        }
    }


    const updatedTeam = await models.Team.updateOne({ _id: teamId }, { ...obj })
    res.send(updatedTeam)

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
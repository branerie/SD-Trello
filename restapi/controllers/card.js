const mongoose = require('mongoose')
const models = require('../models')
const { auth } = require('../utils')
const router = require('express').Router()

router.post('/:id', auth, createCard)

router.put('/:id/:idcard', auth, updateCard)

router.delete('/:id/:idcard', auth, deleteCard)


async function createCard(req, res, next) {
    const userId = req.user._id
    const listId = req.params.id
    const { name, description, members, dueDate, progress } = req.body

    const today = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
   
    const history = [{ 'event': 'Created', 'date': today }]

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const cardCreationResult = await models.Card.create([{ name, description, author: userId, members, dueDate, progress, history }], { session })

        const createdCard = cardCreationResult[0]

        await models.List.updateOne({ _id: listId }, { $push: { cards: createdCard } }, { session })

        await session.commitTransaction()

        session.endSession()

        res.send(createdCard)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }

}

async function updateCard(req, res, next) {
    const userId = req.user._id
    const id = req.params.idcard
    const card = { name, description, members, dueDate, progress, history } = req.body
    const { newMember, teamId, projectId, cardId, listId } = req.body

    const obj = {}
    for (let key in card) {
        if (card[key]) {
            obj[key] = card[key]
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await models.Card.updateOne({ _id: id }, { ...obj }).session(session)
        
        if (newMember) {
            const messageCreationResult = await models.Message.create([{ subject: 'Task assignment', team: teamId, project: projectId, list: listId, card: cardId, sendFrom: userId, recievers: [newMember] }], { session })
            const createdMessage = messageCreationResult[0]
            await models.User.updateOne({ _id: newMember._id }, { $push: { inbox: createdMessage } })
        }

        await session.commitTransaction()
        session.endSession()

        const updatedCard = await models.Card.findOne({ _id: id })
        res.send(updatedCard)

    } catch(err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.send(err);
    }
}

async function deleteCard(req, res, next) {
    const idCard = req.params.idcard
    const idList = req.params.id
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const removedCardResult = await models.Card.deleteOne({ _id: idCard }).session(session)

        removedCard = removedCardResult

        await models.List.updateOne({ _id: idList }, { $pull: { cards: idCard } }).session(session)

        await session.commitTransaction();

        session.endSession();

        res.send(removedCard)
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.send(error);
    }

}

module.exports = router;
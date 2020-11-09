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
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const cardCreationResult = await models.Card.create([{ name, description, author: userId, members, dueDate, progress }], { session })

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
    const id = req.params.idcard
    const card = { name, description, members, dueDate, progress } = req.body;
    const obj = {}
    for (let key in card) {
        if (card[key] && key !== 'members') {
            obj[key] = card[key]
        }
    }


    const updatedCard = await models.Card.updateOne({ _id: id }, { ...obj, $push: { members: { $each: members } } })
    res.send(updatedCard)

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
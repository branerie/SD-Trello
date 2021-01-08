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
    console.log(today);
   
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
    const id = req.params.idcard
    const card = { name, description, members, dueDate, progress, history } = req.body    

    const obj = {}
    for (let key in card) {
        if (card[key]) {
            obj[key] = card[key]
        }
    }


    await models.Card.updateOne({ _id: id }, { ...obj })
    const updatedCard = await models.Card.findOne({ _id: id })
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
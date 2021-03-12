const mongoose = require('mongoose')
const models = require('../models')
const { auth, isAdmin } = require('../utils')
const router = require('express').Router()


router.post('/:id', auth, isAdmin, createList)

router.put('/:id/:idlist', auth, isAdmin, updateList)

router.put('/:id/:idlist/dnd-list', auth, updateListDnD)

router.put('/:id/:idcard/dnd-card', auth, updateCardDnD)

router.delete('/:id/:idlist', auth, isAdmin, deleteList)

async function createList(req, res, next) {
    const userId = req.user._id
    const projectId = req.params.id
    const listName = req.body.name
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const listCreationResult = await models.List.create([{ name: listName, author: userId }], { session })
        const createdList = listCreationResult[0]
        await models.Project.updateOne({ _id: projectId }, { $push: { lists: createdList } }, { session })

        await session.commitTransaction()

        session.endSession()

        res.send(createdList)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }
}

async function updateList(req, res, next) {
    const id = req.params.idlist
    const { name, color } = req.body
    const updatedList = await models.List.updateOne({ _id: id }, { name, color })
    res.send(updatedList)
}

async function updateListDnD(req, res, next) {
    const projectId = req.params.id
    const listId = req.params.idlist
    const { position } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await models.Project.updateOne({ _id: projectId }, { $pull: { lists: listId } }).session(session)
        await models.Project.updateOne({ _id: projectId }, { $push: { lists: { $each: [listId], $position: position } } }).session(session)

        await session.commitTransaction()
        session.endSession()

        const project = await models.Project.findOne({ _id: projectId })
            .populate({
                path: 'lists',
                populate: {
                    path: 'cards',
                    populate: {
                        path: 'members',
                        select: '-password'
                    }
                }
            })
            .populate({
                path: 'membersRoles',
                populate: {
                    path: 'memberId',
                    select: '-password'
                }
            })

        res.send(project)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }
}

async function updateCardDnD(req, res, next) {
    const cardId = req.params.idcard
    const { position, source, destination } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await models.List.updateOne({ _id: source }, { $pull: { cards: cardId } }).session(session)
        await models.List.updateOne({ _id: destination }, { $push: { cards: { $each: [cardId], $position: position } } }).session(session)

        await session.commitTransaction()

        session.endSession()

        res.send('Success')
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }
}

async function deleteList(req, res, next) {
    const idList = req.params.idlist
    const idProject = req.params.id
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const searchedCards = await models.List.findOne({ _id: idList }).select('cards -_id').session(session)

        await models.Card.deleteMany({ _id: { $in: searchedCards.cards } }).session(session)

        const removedListResult = await models.List.deleteOne({ _id: idList }).session(session)

        removedList = removedListResult

        await models.Project.updateOne({ _id: idProject }, { $pull: { lists: idList } }).session(session)

        await session.commitTransaction()

        session.endSession()

        res.send(removedList)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }

}


module.exports = router
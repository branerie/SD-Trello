const mongoose = require('mongoose')
const models = require('../models')
const { auth } = require('../utils')
const router = require('express').Router()
const cloudinary = require('../utils/cloudinary')

router.post('/:id', auth, createCard)

router.put('/attachments/:idcard', auth, addCardAttachments)

router.put('/:id/:idcard/add-member', auth, addTaskMember)

router.put('/:id/:idcard', auth, updateCard)

router.delete('/attachments/:idcard/:idattachment', auth, deleteAttachment)

router.delete('/:id/:idcard', auth, deleteCard)


async function createCard(req, res) {
    const userId = req.user._id
    const listId = req.params.id
    const { name, description, members, dueDate, progress } = req.body

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const history = [{ event: 'Created', date: today }]

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const cardCreationResult = await models.Card.create([{ name, description, author: userId, members, dueDate, progress, history }], { session })
        // eslint-disable-next-line prefer-destructuring
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

async function updateCard(req, res) {
    const id = req.params.idcard
    const editedFields = req.body

    try {
        await models.Card.updateOne({ _id: id }, { ...editedFields })

        const updatedCard = await models.Card.findOne({ _id: id })
            .populate({
                path: 'members',
                select: '-password'
            })

        res.send(updatedCard)

    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

async function addTaskMember(req, res) {
    const userId = req.user._id
    const id = req.params.idcard
    const { members, newMember, teamId, projectId, cardId, listId } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await models.Card.updateOne({ _id: id }, { members }).session(session)

        if (newMember) {
            const team = await models.Team.findOne({ _id: teamId })
            const teamObj = { name: team.name, id: team._id }
            const project = await models.Project.findOne({ _id: projectId })
            const projectObj = { name: project.name, id: projectId }
            const list = await models.List.findOne({ _id: listId })
            const listObj = { name: list.name, id: listId }
            const card = await models.Card.findOne({ _id: cardId })
            const cardObj = { name: card.name, id: cardId }

            const messageCreationResult = await models.Message.create([{
                subject: 'Task assignment',
                team: teamObj, project: projectObj,
                list: listObj, card: cardObj,
                sendFrom: userId,
                recievers: [newMember] }],
            { session })
            // eslint-disable-next-line prefer-destructuring
            const createdMessage = messageCreationResult[0]
            await models.User.updateOne({ _id: newMember._id }, { $push: { inbox: createdMessage } })
        }

        await session.commitTransaction()
        session.endSession()

        const updatedCard = await models.Card.findOne({ _id: id })
            .populate({
                path: 'members',
                select: '-password'
            })

        res.send(updatedCard)

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        console.log(err)
        res.send(err)
    }
}

async function deleteCard(req, res) {
    const idCard = req.params.idcard
    const idList = req.params.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const removedCardResult = await models.Card.deleteOne({ _id: idCard }).session(session)

        const removedCard = removedCardResult

        await models.List.updateOne({ _id: idList }, { $pull: { cards: idCard } }).session(session)

        await session.commitTransaction()

        session.endSession()

        res.send(removedCard)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }

}

async function deleteAttachment(req, res) {
    const cardId = req.params.idcard
    const attachmentId = req.params.idattachment

    try {
        const card = await models.Card.findOne({ _id: cardId })
        // eslint-disable-next-line prefer-destructuring
        const attachment = card.attachments.filter(att => att.id === attachmentId)[0]
        const updatedCard = await models.Card.findOneAndUpdate({ _id: cardId }, { $pull: { attachments: { publicId: attachment.publicId } } }, { new: true })
            .populate({
                path: 'members',
                select: '-password'
            })

        cloudinary.api.delete_resources([attachment.publicId], (error) => { if (error) console.log(error) })

        res.send(updatedCard)

    } catch (error) {
        res.send(error)
    }
}

async function addCardAttachments(req, res) {
    const cardId = req.params.idcard
    const { attachment } = req.body
    const updatedCard = await models.Card.findOneAndUpdate({ _id: cardId }, { $push: { attachments: attachment } }, { new: true })

    res.send(updatedCard)
}

module.exports = router
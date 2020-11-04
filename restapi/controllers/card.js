const mongoose = require('mongoose');
const models = require('../models')
const { auth, isAdmin } = require('../utils')
const router = require('express').Router()

// router.get('/:id', auth, getCard)

router.post('/:id', auth, createCard)

// router.put('/:id/:idlist', auth, updateCard)

// router.delete('projects/:id/list/:id-list', auth, isAdmin, deleteCard)


// async function getCard(req, res, next) {
//     const id = req.params.id;
//     const cards = await models.List.findOne({ _id: id }).select('cards -_id');

//     const populatedCards = await models.List.find({ _id: { $in: cards } }).populate('cards');

//     res.send(populatedCards);
// }

async function createCard(req, res, next) {
    const userId = req.user._id;
    const listId = req.params.id;
    const { name, description } = req.body;    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cardCreationResult = await models.Card.create([{ name, description, author: userId }], { session })
        
        const createdCard = cardCreationResult;
                
        await models.List.updateOne({ _id: listId }, { $push: { cards: createdCard } }, { session })

        await session.commitTransaction();

        session.endSession();

        res.send(createdCard);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.send(error);
    }
}

// async function updateCard(req, res, next) {
//     const id = req.params.idlist;
//     const { name } = req.body;
//     console.log(id, name);
//     const updatedList = await models.List.updateOne({ _id: id }, { name })
//     res.send(updatedList)

// }

// async function deleteCard(req, res, next) {
//     const id = req.params.id;
//     models.Origami.deleteOne({ _id: id })
//         .then((removedOrigami) => res.send(removedOrigami))
//         .catch(next)
// }

module.exports = router;
const mongoose = require('mongoose');
const models = require('../models');

module.exports = {
    get: async (req, res, next) => {
        const id = req.params.id;
        const lists = await models.Project.findOne({ _id: id }).select('lists -_id');

        const populatedLists = await models.List.find({ _id: { $in: lists } }).populate('cards');

        res.send(populatedLists);
    },

    post: async (req, res, next) => {
        const userId = req.user._id;
        const projectId = req.params.id;
        const listName = req.body.name;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const listCreationResult = await models.List.create([{ name: listName, author: userId }], { session });
            const createdList = listCreationResult[0];
                   
            await models.Project.updateOne({ _id: projectId }, { $push: { lists: createdList } }, { session })

            await session.commitTransaction();

            session.endSession();
            
            res.send(createdList);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.send(error);
        }
    },

    put: (req, res, next) => {
        const id = req.params.id;
        const { description } = req.body;
        models.Origami.updateOne({ _id: id }, { description })
            .then((updatedOrigami) => res.send(updatedOrigami))
            .catch(next)
    },

    delete: (req, res, next) => {
        const id = req.params.id;
        models.Origami.deleteOne({ _id: id })
            .then((removedOrigami) => res.send(removedOrigami))
            .catch(next)
    }
};
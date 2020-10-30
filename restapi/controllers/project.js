const mongoose = require('mongoose');
const models = require('../models');

module.exports = {
    get: async (req, res, next) => {
        const { _id } = req.user;
        const projects = await models.ProjectUserRole.find({ memberId: _id })
                                                        .populate('projectId')
                                                        .select('projectId -_id');
        res.send(projects);
    },

    post: async (req, res, next) => {
        const { name } = req.body;
        const { _id } = req.user;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await models.Project.create([{ name, author: _id }], { session })

            const createdProject = await models.Project.findOne({ name }).session(session);
        
            await models.ProjectUserRole.create([{ admin: true, projectId: createdProject.$session(), memberId: _id }], { session })

            const projectUserRole = await models.ProjectUserRole.findOne({ projectId: createdProject.$session(), memberId: _id }).session(session);
            
            models.Project.updateOne({ _id: projectUserRole.$session().projectId }, { $push: { membersRoles: projectUserRole.$session() } }, { session }),
            models.User.updateOne({ _id }, { $push: { projects: projectUserRole.$session() } }, { session })

            await session.commitTransaction();

            session.endSession();

            res.send(createdProject);  
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
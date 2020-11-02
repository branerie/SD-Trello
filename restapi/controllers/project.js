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
            const projectCreationResult = await models.Project.create([{ name, author: _id }], { session });
            const createdProject = projectCreationResult[0];

            await models.ProjectUserRole.create([{ admin: true, projectId: createdProject, memberId: _id }], { session })

            const projectUserRole = await models.ProjectUserRole.findOne({ projectId: createdProject, memberId: _id }).session(session);

            await models.Project.updateOne({ _id: projectUserRole.projectId }, { $push: { membersRoles: projectUserRole } }, { session });
            await models.User.updateOne({ _id }, { $push: { projects: projectUserRole } }, { session })

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
    },

    add: async (req, res, next) => {
        const { newMemberUsername, admin } = req.body;
        const projectId = req.params.id;
        const { _id } = req.user;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const member = await models.User.findOne({ username: newMemberUsername }).select('');
            const projectUserRoleCreation = await models.ProjectUserRole.create([{ admin, projectId, memberId: member._id }], { session });
            const projectUserRole = projectUserRoleCreation[0];

            await models.Project.updateOne({ _id: projectUserRole.projectId }, { $push: { membersRoles: projectUserRole } }, { session });
            await models.User.updateOne({ _id: member._id }, { $push: { projects: projectUserRole } }, { session })

            await session.commitTransaction();

            session.endSession();

            res.send(projectUserRole);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.send({
                errorMessage: error.message,
                error
            });
        }
    }
}
const mongoose = require('mongoose')
const models = require('../models')
const { auth, isAdmin } = require('../utils')
const router = require('express').Router()

router.get('/', auth, getUserProjects)

router.get('/all', auth, getAllProjects)

router.post('/', auth, createProject)

router.put('/:id', auth, isAdmin, updateProject)

router.delete('/:id', auth, isAdmin, deleteProject);

router.post('/:id/user', auth, isAdmin, addMember)




async function getUserProjects(req, res, next) {
    const { _id } = req.user;
    const projects = await models.ProjectUserRole.find({ memberId: _id })
        .populate('projectId')
    res.send(projects);
}

async function getAllProjects(req, res, next) {

    const projects = await models.Project.find({})
    res.send(projects);
}

async function createProject(req, res, next) {
    const { name, description } = req.body;
    const { _id } = req.user;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const projectCreationResult = await models.Project.create([{ name, description, author: _id }], { session });
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
}

async function updateProject(req, res, next) {
    const id = req.params.id;
    const { name, description } = req.body;
    const updatedProject = await models.Project.updateOne({ _id: id }, { name, description })
    res.send(updatedProject)

}

async function deleteProject(req, res, next) {
    const idProject = req.params.id
    const { _id } = req.user
    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        const searchedLists = await models.Project.findOne({ _id: idProject }).select('lists -_id').populate('lists')

        let cardsArray = [];
        searchedLists.lists.map(a => cardsArray = cardsArray.concat(a.cards))

        await models.Card.deleteMany({ _id: { $in: cardsArray } }).session(session)

        let listsArray = [];
        searchedLists.lists.map(a => listsArray.push(a._id))

        await models.List.deleteMany({ _id: { $in: listsArray } }).session(session)

        const projectUserRoles = await models.Project.findOne({ _id: idProject }).select('membersRoles -_id')

        const members = await models.ProjectUserRole.find({ _id: { $in: projectUserRoles.membersRoles } }).select('memberId')

        members.forEach(async (element) => {
            await models.User.updateOne({ _id: element.memberId }, { $pull: { projects: element._id } }).session(session)
            await models.ProjectUserRole.deleteOne({ _id: element._id }).session(session)
        })

        const removedProjectResult = await models.Project.deleteOne({ _id: idProject }).session(session)


        await session.commitTransaction();

        session.endSession();

        res.send(removedProjectResult)
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.send(error);
    }

}

async function addMember(req, res, next) {
    const { newMemberEmail, admin } = req.body;
    const projectId = req.params.id;
    const { _id } = req.user;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const member = await models.User.findOne({ email: newMemberEmail })

        const projectUserRoleCreation = await models.ProjectUserRole.create([{ admin, projectId, memberId: member._id }], { session });
        const projectUserRole = projectUserRoleCreation[0];

        await models.Project.updateOne({ _id: projectUserRole.projectId }, { $push: { membersRoles: projectUserRole } });
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


module.exports = router;
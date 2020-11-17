const mongoose = require('mongoose')
const models = require('../models')
const { auth, isAdmin } = require('../utils')
const router = require('express').Router()

router.get('/', auth, getUserProjects)

router.get('/all', auth, getAllProjects)

router.get('/info/:id', auth, getProjectInfo)

router.post('/', auth, createProject)

router.put('/:id', auth, isAdmin, updateProject)

router.delete('/:id', auth, isAdmin, deleteProject)

router.post('/:id/user', auth, isAdmin, addMember)

router.post('/:id/user-remove', auth, isAdmin, removeMember)





async function getUserProjects(req, res, next) {
    const { _id } = req.user
    const projects = await models.ProjectUserRole.find({ memberId: _id })
        .populate('projectId')
    res.send(projects)
}

async function getAllProjects(req, res, next) {

    const projects = await models.Project.find({})
        .populate('author')
        .populate({
            path: 'membersRoles',
            populate: {
                path: 'memberId',
            }
        })
    res.send(projects)
}

async function getProjectInfo(req, res, next) {
    const projectId = req.params.id
    const project = await models.Project.findOne({ _id: projectId })
        .populate({
            path: 'lists',
            populate: {
                path: 'cards',
                populate: {
                    path: 'members'
                }
            }
        })
        .populate({
            path: 'membersRoles',
            populate: {
                path: 'memberId',
            }
        })
    res.send(project)
}

async function createProject(req, res, next) {
    const { name, description } = req.body
    const { _id } = req.user

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const projectCreationResult = await models.Project.create([{ name, description, author: _id }], { session })
        const createdProject = projectCreationResult[0]

        await models.ProjectUserRole.create([{ admin: true, projectId: createdProject, memberId: _id }], { session })

        const projectUserRole = await models.ProjectUserRole.findOne({ projectId: createdProject, memberId: _id }).session(session)

        await models.Project.updateOne({ _id: projectUserRole.projectId }, { $push: { membersRoles: projectUserRole } }, { session })
        await models.User.updateOne({ _id }, { $push: { projects: projectUserRole } }, { session })

        await session.commitTransaction()

        session.endSession()

        res.send(createdProject)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }
}

async function updateProject(req, res, next) {
    const projectId = req.params.id;
    const project = { name, description } = req.body;


    const obj = {}
    for (let key in project) {
        if (project[key]) {
            obj[key] = project[key]
        }
    }

    try {
        const updatedProject = await models.Project.updateOne({ _id: projectId }, { ...obj })

        res.send(updatedProject)
    } catch (error) {
        res.send(error)
    }

}

async function deleteProject(req, res, next) {
    const idProject = req.params.id
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const searchedLists = await models.Project.findOne({ _id: idProject }).select('lists -_id').populate('lists')

        let cardsArray = []
        searchedLists.lists.map(a => cardsArray = cardsArray.concat(a.cards))

        await models.Card.deleteMany({ _id: { $in: cardsArray } }).session(session)

        let listsArray = []
        searchedLists.lists.map(a => listsArray.push(a._id))

        await models.List.deleteMany({ _id: { $in: listsArray } }).session(session)

        const projectUserRoles = await models.Project.findOne({ _id: idProject }).select('membersRoles -_id')

        const members = await models.ProjectUserRole.find({ _id: { $in: projectUserRoles.membersRoles } }).select('memberId')

        members.forEach(async (element) => {
            await models.User.updateOne({ _id: element.memberId }, { $pull: { projects: element._id } }).session(session)
            await models.ProjectUserRole.deleteOne({ _id: element._id }).session(session)
        })

        const removedProjectResult = await models.Project.deleteOne({ _id: idProject }).session(session)

        await session.commitTransaction()

        session.endSession()

        res.send(removedProjectResult)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }

}

async function addMember(req, res, next) {
    const { member, admin } = req.body
    const projectId = req.params.id
    const { _id } = req.user

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        const projectUserRoleCreation = await models.ProjectUserRole.create([{ admin, projectId, memberId: member._id }], { session })
        const projectUserRole = projectUserRoleCreation[0]

        await models.Project.updateOne({ _id: projectUserRole.projectId }, { $push: { membersRoles: projectUserRole } })
        await models.User.updateOne({ _id: member._id }, { $push: { projects: projectUserRole } }, { session })

        await session.commitTransaction()

        session.endSession()

        res.send(projectUserRole)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send({
            errorMessage: error.message,
            error
        })
    }
}

async function removeMember(req, res, next) {
    const { memberId } = req.body
    const projectId = req.params.id
    const { _id } = req.user


    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const member = await models.User.findOne({ _id: memberId })
        const projectUserRoleForRemove = await models.ProjectUserRole.findOne({ projectId, memberId: member._id })

        await models.User.updateOne({ _id: member._id }, { $pull: { projects: projectUserRoleForRemove._id } }).session(session)

        await models.Project.updateOne({ _id: projectId }, { $pull: { membersRoles: projectUserRoleForRemove._id } }).session(session)
        const deletedProjectUserRole = await models.ProjectUserRole.deleteOne({ _id: projectUserRoleForRemove._id }).session(session)

        await session.commitTransaction()

        session.endSession()

        res.send(deletedProjectUserRole)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.send({
            errorMessage: error.message,
            error
        })
    }
}


module.exports = router
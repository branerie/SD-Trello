const mongoose = require('mongoose')
const models = require('../models')
const { auth, isAdmin } = require('../utils')
const router = require('express').Router()

router.get('/', auth, getUserProjects)

router.get('/all', auth, getAllProjects)

router.get('/info/:id', auth, getProjectInfo)

router.post('/', auth, createProject)

router.put('/:id/user-roles', auth, isAdmin, updateUserRoles)

router.put('/:id', auth, isAdmin, updateProject)

router.delete('/:id', auth, isAdmin, deleteProject)

router.post('/:id/user', auth, isAdmin, addMember)

router.post('/:id/user-remove', auth, isAdmin, removeMember)

async function getUserProjects(req, res) {
    const { _id } = req.user
    const projects = await models.ProjectUserRole.find({ memberId: _id })
        .populate('projectId')
    res.send(projects)
}

async function getAllProjects(req, res) {

    const projects = await models.Project.find({})
        .populate({
            path: 'author',
            select: '-password'
        })
        .populate({
            path: 'membersRoles',
            populate: {
                path: 'memberId',
                select: '-password'
            }
        })
    res.send(projects)
}

async function getProjectInfo(req, res) {
    const projectId = req.params.id
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
}

async function createProject(req, res) {
    const { name, description, teamId, members } = req.body
    const { _id } = req.user
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const projectCreationResult = await models.Project.create(
            [{ name, description, isFinished: false, author: _id }],
            { session })
        // eslint-disable-next-line prefer-destructuring
        const createdProject = projectCreationResult[0]


        await models.ProjectUserRole.create([{ admin: true, projectId: createdProject, memberId: _id }], { session })

        const membersArr = []

        for (const member of members) {
            const projectUserRoleCreation = await models.ProjectUserRole.create(
                [{ admin: false, projectId: createdProject._id, memberId: member._id }],
                { session })
            // eslint-disable-next-line prefer-destructuring
            const currProjectUserRole = projectUserRoleCreation[0]
            membersArr.push(currProjectUserRole)
            await models.User.updateOne({ _id: member._id }, { $push: { projects: currProjectUserRole } }, { session })
        }

        const projectUserRole = await models.ProjectUserRole.findOne({ projectId: createdProject, memberId: _id })
            .session(session)
        membersArr.push(projectUserRole)
        const updatedProject = await models.Project.findByIdAndUpdate(
            { _id: projectUserRole.projectId },
            { $push: { membersRoles: membersArr } },
            { new: true })
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
            }).session(session)
        await models.User.updateOne({ _id }, { $push: { projects: projectUserRole } }, { session })

        await models.Team.updateOne({ _id: teamId }, { $push: { projects: createdProject } }, { session })

        await session.commitTransaction()

        session.endSession()

        res.send(updatedProject)
    } catch (error) {
        console.log(error)
        await session.abortTransaction()
        session.endSession()
        res.send(error)
    }
}

async function updateProject(req, res) {
    const projectId = req.params.id
    const project = req.body

    try {
        const updatedProject = await models.Project.updateOne({ _id: projectId }, { ...project })

        res.send(updatedProject)
    } catch (error) {
        res.send(error)
    }

}

async function updateUserRoles(req, res) {

    const { userRole, isAdmin } = req.body

    try {
        const updatedUserRole = await models.ProjectUserRole.updateOne({ _id: userRole }, { admin: isAdmin })
        res.send(updatedUserRole)
    } catch (error) {
        res.send(error)
    }

}

async function deleteProject(req, res) {
    const userId = req.user._id
    const idProject = req.params.id
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const projectForDelete = await models.Project.findOne({ _id: idProject }).populate('lists')

        let cardsArray = []
        projectForDelete.lists.map(a => cardsArray = cardsArray.concat(a.cards))

        await models.Card.deleteMany({ _id: { $in: cardsArray } }).session(session)

        const listsArray = []
        projectForDelete.lists.map(a => listsArray.push(a._id))

        await models.List.deleteMany({ _id: { $in: listsArray } }).session(session)

        const projectUserRoles = await models.Project.findOne({ _id: idProject }).select('membersRoles -_id')

        const members = await models.ProjectUserRole.find({ _id: { $in: projectUserRoles.membersRoles } })

        const membersArr = []

        for (const element of members) {
            await models.User.updateOne({ _id: element.memberId }, { $pull: { projects: element._id } }).session(session)
            await models.ProjectUserRole.deleteOne({ _id: element._id }).session(session)
            membersArr.push(element.memberId)
        }

        await models.Team.updateOne({ projects: idProject }, { $pull: { projects: idProject } }).session(session)

        const projectObj = { name: projectForDelete.name, id: idProject, isDeleted: true }
        const messages = await models.Message.find({ 'project.id': idProject })

        for (const m of messages) {
            await models.Message.updateOne({ _id: m._id }, { project: projectObj }).session(session)
        }

        const messageCreationResult = await models.Message.create(
            [{ subject: 'Project deleted', project: projectObj, sendFrom: userId, recievers: membersArr }],
            { session })
        // eslint-disable-next-line prefer-destructuring
        const createdMessage = messageCreationResult[0]

        await models.User.updateMany({ _id: { $in: membersArr } }, { $push: { inbox: createdMessage } }, { session })

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

async function addMember(req, res) {
    const { member, admin } = req.body
    const projectId = req.params.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        const projectUserRoleCreation = await models.ProjectUserRole.create(
            [{ admin, projectId, memberId: member._id }],
            { session })
        // eslint-disable-next-line prefer-destructuring
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

async function removeMember(req, res) {
    const { memberId } = req.body
    const projectId = req.params.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const member = await models.User.findOne({ _id: memberId })
        const projectUserRoleForRemove = await models.ProjectUserRole.findOne({ projectId, memberId: member._id })

        await models.User.updateOne({ _id: member._id }, { $pull: { projects: projectUserRoleForRemove._id } }).session(session)

        await models.Project.updateOne({ _id: projectId }, { $pull: { membersRoles: projectUserRoleForRemove._id } })
            .session(session)
        const deletedProjectUserRole = await models.ProjectUserRole.deleteOne({ _id: projectUserRoleForRemove._id })
            .session(session)

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
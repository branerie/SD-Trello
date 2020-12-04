const models = require('../models')

async function projectUpdate(id) {
    const project = await models.Project.findOne({ _id: id })
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
    return project
}

async function teamUpdate(id) {
    try {
        const team = await models.Team.findOne({ _id: id })
            .populate({
                path: 'projects',
                populate: {
                    path: 'membersRoles',
                    populate: {
                        path: 'memberId'
                    }
                }
            })
            .populate({
                path: 'projects',
                populate: {
                    path: 'author'
                }
            })
        return team

    } catch (error) {
        console.log(error);
    }
}

module.exports = { projectUpdate, teamUpdate }
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

module.exports = { projectUpdate }
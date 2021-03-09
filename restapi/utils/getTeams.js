const models = require('../models')

async function getTeams(id) {

    try {
        const teams = await models.Team.find({ members: id })
            .populate({
                path: 'projects',
                populate: {
                    path: 'membersRoles',
                    populate: {
                        path: 'memberId',
                        select: '-password'
                    }
                }
            })
            .populate({
                path: 'projects',
                populate: {
                    path: 'author',
                    select: '-password'
                }
            })
            .populate({
                path: 'members',
                select: '-password'
            })
            .populate({
                path: 'requests'                
            })
        return teams

    } catch (error) {
        console.log(error);
    }
}

module.exports = getTeams
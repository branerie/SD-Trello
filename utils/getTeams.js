const models = require("../models");

async function getTeams(id) {

    try {
        const teams = await models.Team.find({ members: id })
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
        return teams

    } catch (error) {
        console.log(error);
    }
}

module.exports = getTeams
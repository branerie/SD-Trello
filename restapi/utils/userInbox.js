const models = require("../models")

async function userInbox(userId) {
    const user = await models.User.findOne({ _id: userId })
        .populate([{
            path: 'inbox',
            populate: [{
                path: 'team',
                populate: [{
                    path: 'members',
                    select: 'username'
                }, {
                    path: 'requests',
                    select: 'username'
                }]
            }, {
                path: 'sendFrom',
                select: 'username'
            }, {
                path: 'project',
                select: 'name'
            }, {
                path: 'list',
                select: 'name'
            }, {
                path: 'card',
                select: 'name'
            }]
        }, {
            path: 'inboxHistory',
            populate: [{
                path: 'team',
                populate: [{
                    path: 'members',
                    select: 'username'
                }, {
                    path: 'requests',
                    select: 'username'
                }]
            }, {
                path: 'sendFrom',
                select: 'username'
            }, {
                path: 'project',
                select: 'name'
            }, {
                path: 'list',
                select: 'name'
            }, {
                path: 'card',
                select: 'name'
            }]
        }])
        .select('inbox inboxHistory -_id')

    return user
}

module.exports = userInbox
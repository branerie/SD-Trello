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
                path: 'invitedBy',
                select: 'username'
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
                path: 'invitedBy',
                select: 'username'
            }]
        }])
        .select('inbox inboxHistory -_id')

    return user
}

module.exports = userInbox
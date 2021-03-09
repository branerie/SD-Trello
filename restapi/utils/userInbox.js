const models = require('../models')

async function userInbox(userId) {
    const user = await models.User.findOne({ _id: userId })
        .populate([{
            path: 'inbox',
            populate: {
                path: 'sendFrom',
                select: 'username'
            }
        }, {
            path: 'inboxHistory',
            populate: {
                path: 'sendFrom',
                select: 'username'
            }
        }])
        .select('inbox inboxHistory -_id')

    return user
}

module.exports = userInbox
const models = require('../models')

module.exports = async (req, res, next) => {
    const userId = req.user._id
    const projectId = req.params.id

    const userAdminField = await models.ProjectUserRole.findOne({ projectId, memberId: userId }).select('admin -_id')

    if (!userAdminField.admin) {
        return res.send('is not admin')
    }

    next()
}
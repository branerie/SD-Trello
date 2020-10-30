const models = require('../models');



module.exports = () => {

    return async (req, res, next) => {
        const userId = req.user._id;
        const projectId = req.params.id;
       
        const isAdmin = await models.ProjectUserRole.findOne({ projectId, memberId: userId }).select('admin -_id');
        
        req.isAdmin = isAdmin;
        
        if (!isAdmin) {
            return res.send('is not admin');
        };

        next();
    }
};
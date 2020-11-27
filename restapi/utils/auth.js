const jwt = require('./jwt');
const models = require('../models');

module.exports = function (req, res, next) {
  console.log('auth');
  const token = req.headers.authorization || '';


  jwt.verifyToken(token).then(data => {
    models.User.findById(data.id)
      .then((user) => {
        req.user = user;
        next();
      }).catch(err => {
        next(err)
      });
  })
};

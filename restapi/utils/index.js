const jwt = require('./jwt');
const auth = require('./auth');
const isAdmin = require('./isAdmin');
const sendConfirmationEmail = require('./mailer')

module.exports = {
    jwt,
    auth,
    isAdmin,
    sendConfirmationEmail
};
const jwt = require('./jwt')
const auth = require('./auth')
const googleAuth = require('./googleAuth')
const isAdmin = require('./isAdmin')
const sendConfirmationEmail = require('./mailer')
const userInbox = require('./userInbox')

module.exports = {
    jwt,
    auth,
    isAdmin,
    sendConfirmationEmail,
    userInbox,
    googleAuth
}
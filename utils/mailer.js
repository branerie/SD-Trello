const nodemailer = require('nodemailer')

const from = '"Smart Manager" <info@smart-manager.com>'

function setup() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

module.exports = function sendConfirmationEmail(user) {
    const transport = setup()
    const email = {
        from,
        to: user.email,
        subject: 'Welcome to Smart Manager',
        text: `
        Welcome to Smart Manager. Please confirm your email

        ${user.generateConfirmationUrl()}
        `
    }

    transport.sendMail(email)
}

// module.exports = function sendChangePasswordEmail(user) {
//     const transport = setup()
//     const email = {
//         from,
//         to: user.email,
//         subject: 'Smart Manager - New password',
//         text: `
//         In order to activate your new password, please confirm your email by following the link below

//         ${user.generateConfirmationUrl()}
//         `
//     }

//     transport.sendMail(email)
// }
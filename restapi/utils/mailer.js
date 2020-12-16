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
        Welcome to Smart Manager. Please comfirm your email

        ${user.generateConfirmationUrl()}
        `
    }

    transport.sendMail(email)
}
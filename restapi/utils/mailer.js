const nodemailer = require('nodemailer')

const from = 'Smart Manager <info@smart-manager.com>'

function setup() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

module.exports = function sendConfirmationEmail(user, type) {
    const transport = setup()
    let email
    if (type === 'account') {
        email = {
            from,
            to: user.email,
            subject: 'Welcome to Smart Manager',
            text: `
        Welcome to Smart Manager. Please comfirm your email

        ${user.generateConfirmationUrl()}
        `
        }
    } 
    if(type === 'pass'){
        email = {
            from,
            to: user.email,
            subject: 'Request for password change at Smart Manager',
            text: `
            There was a request for password change of your account in Smart Manager. If it was you, please follow the link bellow. It will be valid for one hour.
    
            ${user.generateConfirmationUrl()}
            `
        }
    }

    transport.sendMail(email)
}
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const oauth2Client = new OAuth2(
    process.env.EMAIL_CLIENT_ID,
    process.env.EMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URL
)

oauth2Client.setCredentials({ refresh_token: process.env.EMAIL_CLIENT_REFRESH })

const from = 'Smart Manager <info@smart-manager.com>'

function setup() {
    const accessToken = oauth2Client.getAccessToken()

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'smtest36@gmail.com',
            clientId: process.env.EMAIL_CLIENT_ID,
            clientSecret: process.env.EMAIL_CLIENT_SECRET,
            refreshToken: process.env.EMAIL_CLIENT_REFRESH,
            accessToken: accessToken
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
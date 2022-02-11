const nodemailer = require('nodemailer')
// const { google } = require('googleapis')

// const { OAuth2 } = google.auth
// const oauth2Client = new OAuth2(
//     process.env.EMAIL_CLIENT_ID,
//     process.env.EMAIL_CLIENT_SECRET,
//     'https://developers.google.com/oauthplayground' // Redirect URL
// )

// oauth2Client.setCredentials({ refresh_token: process.env.EMAIL_CLIENT_REFRESH })

const from = 'Smart Manager <info@manager.smartdesign2006.com>'

// function setup() {
//     const accessToken = oauth2Client.getAccessToken()

//     return nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true,
//         auth: {
//             type: 'OAuth2',
//             user: 'smtest36@gmail.com',
//             clientId: process.env.EMAIL_CLIENT_ID,
//             clientSecret: process.env.EMAIL_CLIENT_SECRET,
//             refreshToken: process.env.EMAIL_CLIENT_REFRESH,
//             accessToken: accessToken
//         }
//     })
// }

module.exports = async function sendConfirmationEmail(user, type) {
    let email
    if (type === 'account') {
        email = {
            from,
            to: user.email,
            subject: 'Welcome to Smart Manager',
            text: `
        Welcome to Smart Manager. Please confirm your email

        ${user.generateConfirmationUrl()}
        `
        }
    } else if (type === 'pass') {
        email = {
            from,
            to: user.email,
            subject: 'Request for password change at Smart Manager',
            text: `
            There was a request for a password change of your account on Smart Manager. If it was made by you, please follow the link bellow. The link will be valid for one hour.
    
            ${user.generateConfirmationUrl()}
            `
        }
    } else {
        return
    }

    const transport = await nodemailer.createTransport({
        // host: 'mail.branerie.com',
        host: 'hertz.superhosting.bg',
        // port: 465,
        // secure: true,
        port: 25,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    }) // setup()

    await transport.sendMail(email)
}
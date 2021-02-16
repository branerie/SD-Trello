const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleAuth = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    console.log(`User ${payload.name} verified`)

    const { email, name, picture, email_verified } = payload

    return { email, username: name, email_verified }

}

module.exports = googleAuth
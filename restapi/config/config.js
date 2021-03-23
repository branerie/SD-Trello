const env = process.env.NODE_ENV || 'development'

const config = {
    development: {
        authCookieName: 'x-auth-token'
    },
    production: {}
}

module.exports = config[env]
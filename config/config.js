const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 4000,
        authCookieName: 'x-auth-token',
        cookieSecret: "cookieSecret"
    },
    production: {}
};

module.exports = config[env];
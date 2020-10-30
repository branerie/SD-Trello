const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 4000,
        dbURL: 'mongodb+srv://smartdesign2006:smartdesign2006@cluster0.nfliw.mongodb.net/<DBTrello>?retryWrites=true&w=majority',
        authCookieName: 'x-auth-token',
        cookieSecret: "cookieSecret"
    },
    production: {}
};

module.exports = config[env];
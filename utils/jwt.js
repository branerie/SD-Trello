const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

const createToken = (data) => {
    return jwt.sign(data, secret, { expiresIn: '1w' })
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                reject(err)
                return
            }

            resolve(data)
        })
    })
}

module.exports = {
    createToken,
    verifyToken
}
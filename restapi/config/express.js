const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const router = require('./routes')
const path = require('path')

const secret = process.env.COOKIE_SECRET

module.exports = (app) => {
    app.use(cors({
        exposedHeaders: 'Authorization'
    }))

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))

    app.use(cookieParser(secret))

    app.use('/api', router)

    app.use(express.static(path.join(__dirname, '../build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build', 'index.html'))
    })

    app.use((err, req, res) => {
        if (err.name === 'ValidationError' || err.name === 'MongoError') {
            res.status(403)
        } else {
            res.status(500)
        }

        res.send(err.message)
    })
}
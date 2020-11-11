const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require("./config");
const router = require('./routes')
const secret = config.cookieSecret;

module.exports = (app) => {
  app.use(cors({
    exposedHeaders: 'Authorization'
  }));

  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }));

  app.use(cookieParser(secret))

  app.use('/', router)

  app.use(function (err, req, res, next) {
    if (err.name === 'ValidationError' || err.name === 'MongoError') {
      res.status(403)
    } else {
      res.status(500)
    }

    res.send(err.message);
  });
};
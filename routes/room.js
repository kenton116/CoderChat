'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Quiz = require('../models/quiz');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/quiz', authenticationEnsurer, csrfProtection,(req, res, next) => {
  res.render('quizroom', { 
    title: "クイズルーム - CoderChat",
    user: req.user,
    csrfToken: req.csrfToken()
   });
});

module.exports = router;
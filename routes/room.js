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
    user: req.user,
    csrfToken: req.csrfToken()
   });
});

router.post('/quiz/report', authenticationEnsurer, csrfProtection,(req, res, next) => {
  Quiz.increment('badReview', {
    where: {
      quizId: req.body.quizId
    }})
    .then(() => {
      res.redirect('/room/quiz');
    });
});

router.post('/quiz/star', authenticationEnsurer, csrfProtection,(req, res, next) => {
  Quiz.increment('star', {
    where: {
      quizId: req.body.quizId
    }})
    .then(() => {
      res.redirect('/room/quiz');
    });
});

module.exports = router;
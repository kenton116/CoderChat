'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Quiz = require('../models/quiz');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/quiz', authenticationEnsurer, csrfProtection,(req, res, next) => {
  res.render('quizroom', { 
    user: req.user,
    csrfToken: req.csrfToken()
   });
});

router.get('/chat', authenticationEnsurer, csrfProtection,(req, res, next) => {
  res.render('chatroom', { 
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
      setTimeout(() => {
        res.redirect('/room/quiz');
      }, 1000);
    });
});

router.post('/quiz/star', authenticationEnsurer, csrfProtection,(req, res, next) => {
  Quiz.increment('star', {
    where: {
      quizId: req.body.quizId
    }})
    .then(() => {
      setTimeout(() => {
        res.redirect('/room/quiz');
      }, 1000);
    });
});

module.exports = router;
'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Quiz = require('../models/quiz');

router.get('/', authenticationEnsurer, (req, res, next) => {
  res.render('room', { user: req.user });
});

router.get('/quiz', authenticationEnsurer, (req, res, next) => {
  res.render('quizroom', { user: req.user });
});

router.get('/chat', authenticationEnsurer, (req, res, next) => {
  res.render('chatroom', { user: req.user });
});

router.post('/quiz/report', authenticationEnsurer, (req, res, next) => {
  Quiz.increment('badReview', {
    where: {
      quizId: req.body.quizId
    }})
    .then(() => {
      res.redirect('/room/quiz')
    });
});

module.exports = router;
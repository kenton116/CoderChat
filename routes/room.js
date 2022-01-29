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

router.post( '/report', authenticationEnsurer, (req, res, next) => {
  console.log(JSON.parse(data))
  Quiz.increment('badReview', {
    where: {
      quizid: reportId
    }});
}
);

module.exports = router;
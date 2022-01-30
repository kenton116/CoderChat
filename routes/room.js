'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Quiz = require('../models/quiz');

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
      setTimeout(function(){
        res.redirect('/room/quiz');
      }, 1000);
    });
});

router.post('/quiz/star', authenticationEnsurer, (req, res, next) => {
  Quiz.increment('star', {
    where: {
      quizId: req.body.quizId
    }})
    .then(() => {
      setTimeout(function(){
        res.redirect('/room/quiz');
      }, 1000);
    });
});

module.exports = router;
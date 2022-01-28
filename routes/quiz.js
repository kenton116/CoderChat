'use strict';
const express = require('express');
const router = express.Router();
const quiz = require('../models/quiz');
const authenticationEnsurer = require('./authentication-ensurer');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.get('/error', authenticationEnsurer, (req, res, next) => {
  const err = new Error('クイズを作成できませんでした。もう一度作り直してください。');
  next(err);
});

router.post('/', authenticationEnsurer, (req, res, next) => {

  if (req.body.quizName.length >= 255) {
    return res.redirect('/quiz/error');
  }

  quiz.create({
    quizName: req.body.quizName,  
    question: req.body.question,
    answer: req.body.answer,
    tag: req.body.tagvalue,
    createdBy: req.user.id,
    updatedAt: new Date(),
    badReview: 0
  })
  return res.redirect('/dashboard');
});
module.exports = router;
'use strict';
const express = require('express');
const router = express.Router();
const quiz = require('../models/quiz');
const authenticationEnsurer = require('./authentication-ensurer');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

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

  const date = dayjs()
  .tz('Asia/Tokyo')
  .format('YYYY年MM月DD日 HH時mm分ss秒');

  console.log(date);

  quiz.create({
    quizName: req.body.quizName,  
    question: req.body.question,
    answer: req.body.answer,
    tag: req.body.tagvalue,
    createdBy: req.user.id,
    createUser: req.user.username,
    updatedAt: date,
    badReview: 0
  })
  return res.redirect('/dashboard');
});
module.exports = router;
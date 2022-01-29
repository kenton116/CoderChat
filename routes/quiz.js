'use strict';
const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');
const User = require('../models/user');
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
  const err = new Error('クイズを作成または編集できませんでした。もう一度やりなおしてください。');
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
  console.log(req.body.tagvalue);

  Quiz.create({
    quizName: req.body.quizName,  
    question: req.body.question,
    answer: req.body.answer,
    tag: req.body.tagvalue,
    createdBy: req.user.id,
    createUser: req.user.username,
    updatedAt: date,
    badReview: 0
  }).then((quiz) => {
    return res.redirect('/quiz/' + quiz.quizId);
  })
});

router.get('/:quizId', authenticationEnsurer, (req, res, next) => {
  Quiz.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
      quizId: req.params.quizId
    },
    order: [['updatedAt', 'DESC']]
  }).then((quiz) => {
    if(quiz) {
      res.render('quiz', {
        user: req.user,
        quiz: quiz
    });
    } else {
      const err = new Error('指定されたクイズは見つかりません');
      err.status = 404;
      next(err);
    }
  });
});

router.get('/:quizId/edit', authenticationEnsurer, (req, res, next) => {
  Quiz.findOne({
    where: {
      quizId: req.params.quizId
    }
  }).then((quiz) => {
    if (isMine(req, quiz)) { // 作成者のみが編集フォームを開ける
      res.render('edit', {
        user: req.user,
        quiz: quiz,
    });
    } else {
      const err = new Error('指定されたクイズがない、または、編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

router.post('/:quizId', authenticationEnsurer, (req, res, next) => {
  Quiz.findOne({
    where: {
      quizId: req.params.quizId
    }
  }).then((quiz) => {
    if (quiz && isMine(req, quiz)) {
      if (parseInt(req.query.edit) === 1) {
        if (req.body.quizName.length >= 255) {
          return res.redirect('/quiz/error');
        }
        const date = dayjs()
        .tz('Asia/Tokyo')
        .format('YYYY年MM月DD日 HH時mm分ss秒');

        quiz.update({
          quizId: quiz.quizId,
          quizName: req.body.quizName,  
          question: req.body.question,
          answer: req.body.answer,
          tag: req.body.tagvalue,
          createdBy: req.user.id,
          createUser: req.user.username,
          updatedAt: date
        }).then(() => {
          res.redirect('/dashboard')
        })
      } else if (parseInt(req.query.delete) === 1) {
          deleteQuizAggregate(req.params.quizId)
          res.redirect('/dashboard'); 
      } else {
        const err = new Error('不正なリクエストです');
        err.status = 400;
        next(err);
      }
    } else {
      const err = new Error('指定されたクイズがない、または、編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

function deleteQuizAggregate(quizId, done, err) {
  Quiz.findOne({
    where: { quizId: quizId }
  }).then((quiz) => {
    quiz.destroy();
  });
}

router.deleteQuizAggregate = deleteQuizAggregate;

function isMine(req, quiz) {
  return quiz && parseInt(quiz.createdBy) === parseInt(req.user.id);
}

module.exports = router;
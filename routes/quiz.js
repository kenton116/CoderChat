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
// const config = require('../config-local');

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/new', authenticationEnsurer, csrfProtection, (req, res, next) => {
  res.render('new', {
    user: req.user,
    csrfToken: req.csrfToken()
  });
});

router.post('/search/', authenticationEnsurer, (req, res, next) => {
  Quiz.findAll({
    where: {
      tag: req.body.search,
    },
    order: [['star', 'DESC']]
  }).then(quizzes => {
      res.render('search-quiz', {
        user: req.user,
        tag: req.body.search,
        quizzes: quizzes,
      });
    });
});

router.post('/', authenticationEnsurer, csrfProtection, (req, res, next) => {
  const date = dayjs()
  .tz('Asia/Tokyo')
  .format('YYYY年MM月DD日 HH時mm分ss秒');

  Quiz.create({
    quizName: req.body.quizname,
    question: req.body.question,
    answer: req.body.answer,
    tag: req.body.tagvalue,
    createdBy: req.user.id,
    createUser: req.user.username,
    updatedAt: date,
    badReview: 0,
    star: 0
  }).then((quiz) => {
    return res.redirect('/quiz/' + quiz.quizId);
  })
});

router.get('/:quizId',authenticationEnsurer,(req, res, next) => {
  Quiz.findOne({
    include: [{
      model: User,
      attributes: ['userId', 'username']
    }],
    where: {
      quizId: req.params.quizId
    },
  }).then((quiz) => {
    if(quiz) {
      res.render('quiz', {
        user: req.user,
        quiz: quiz,
        adminGithub: process.env.ADMIN_GITHUB /*|| config.admin.github*/,
        adminGoogle: process.env.ADMIN_GOOGLE /*|| config.admin.google*/,
      });
    } else {
      const err = new Error('指定されたクイズは見つかりません');
      err.status = 404;
      next(err);
    }
  });
});

router.get('/:quizId/edit', authenticationEnsurer, csrfProtection, (req, res, next) => {
  Quiz.findOne({
    where: {
      quizId: req.params.quizId
    }
  }).then((quiz) => {
    if (isMine(req, quiz) || isAdmin(req)) {
      res.render('edit', {
        user: req.user,
        quiz: quiz,
        csrfToken: req.csrfToken()
      });
    } else {
      const err = new Error('指定されたクイズがない、または、編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

router.post('/:quizId', authenticationEnsurer, csrfProtection, (req, res, next) => {
  Quiz.findOne({
    where: {
      quizId: req.params.quizId
    }
  }).then((quiz) => {
    if (quiz && (isMine(req, quiz) || isAdmin(req))) {
      if (parseInt(req.query.edit) === 1) {
        const date = dayjs()
        .tz('Asia/Tokyo')
        .format('YYYY年MM月DD日 HH時mm分ss秒');

        quiz.update({
          quizId: quiz.quizId,
          quizName: req.body.quizName,
          question: req.body.question,
          answer: req.body.answer,
          tag: req.body.tagvalue,
          updatedAt: date
        }).then(() => {
          res.redirect('/quiz/' + quiz.quizId)
        })
      } else if (parseInt(req.query.delete) === 1) {
          deleteQuizAggregate(req.params.quizId)
          res.redirect('/quiz/' + quiz.quizId); 
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

function isAdmin(req) {
  const isAdmin = (process.env.ADMIN_GOOGLE /*|| config.admin.google*/ === perseInt(req.user.id)) || (process.env.ADMIN_GITHUB /*|| config.admin.github*/ === perseInt(req.user.id));
  return isAdmin;
}

module.exports = router;
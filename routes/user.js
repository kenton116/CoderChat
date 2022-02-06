'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const User = require('../models/user');
const Quiz = require('../models/quiz')

router.get('/:userId', authenticationEnsurer,(req, res, next) => {
  User.findOne({
    where: {
      userId: req.params.userId
    }
  }).then((user) => {
    if(!user) {
      const err = new Error('指定されたユーザーは見つかりません');
      err.status = 404;
      next(err);
    }
    Quiz.findAll({
      where: {
        createdBy: user.userId
      },
      order: [['star','DESC']]
    }).then((quizzes) => {
      if(user) {
        res.render('user', {
          user: user,
          quizzes: quizzes,
        });
      } else {
        const err = new Error('指定されたユーザーは見つかりません');
        err.status = 404;
        next(err);
      }
    });
  });
});

module.exports = router;
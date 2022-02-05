'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const User = require('../models/user');
const Quiz = require('../models/quiz')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

router.get('/:userId',authenticationEnsurer,(req, res, next) => {
  User.findOne({
    where: {
      userId: req.params.userId
    },
  }).then((user) => {
    Quiz.findAll({
      whre: {
        createdBy: req.params.userId
      },
      order: [['star','DESC']]
    }).then((quiz) => {
      if(user) {
        res.render('user', {
          user: user,
          quiz: quiz,
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
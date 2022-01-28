'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');

router.get('/', authenticationEnsurer, (req, res, next) => {
  res.render('room', { uesr: req.user });
});

router.get('/quiz', authenticationEnsurer, (req, res, next) => {
  res.render('quizroom', { user: req.user });
});

router.get('/chat', authenticationEnsurer, (req, res, next) => {
  res.render('chatroom', { user: req.user });
});

module.exports = router;
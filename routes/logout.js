'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');

router.get('/', authenticationEnsurer , (req, res, next) => {
  req.logout();
  res.render('logout', {
    title: "ログアウト - CoderChat",
    user: req.user
  })
});

module.exports = router;
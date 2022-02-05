'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('docs', {
    user: req.user
  });
});

router.get('/terms', (req, res, next) => {
  res.render('terms', {
    user: req.user
  });
});

router.get('/policies', (req, res, next) => {
  res.render('policies', {
    user: req.user
  });
});

router.get('/site', (req, res, next) => {
  res.render('site', {
    user: req.user
  });
});

module.exports = router;
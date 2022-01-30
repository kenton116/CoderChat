'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('docs');
});

router.get('/terms', (req, res, next) => {
  res.render('terms');
});

router.get('/policies', (req, res, next) => {
  res.render('policies');
});

router.get('/site', (req, res, next) => {
  res.render('site');
});

module.exports = router;
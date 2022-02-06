'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('docs', {
    title: "ドキュメント - CoderChat",
    user: req.user
  });
});

router.get('/terms', (req, res, next) => {
  res.render('terms', {
    title: "利用規約 - CoderChat",
    user: req.user
  });
});

router.get('/policies', (req, res, next) => {
  res.render('policies', {
    title: "プライバシーポリシー - CoderChat",
    user: req.user
  });
});

router.get('/site', (req, res, next) => {
  res.render('site', {
    title: "このサイトについて - CoderChat",
    user: req.user
  });
});

module.exports = router;
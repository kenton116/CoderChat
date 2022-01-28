const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Quiz = require('../models/quiz');

router.get('/', authenticationEnsurer, (req, res, next) => {
  if (req.user) {
    Quiz.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt', 'DESC']]
    }).then(quizzes => {
      res.render('dashboard', {
        user: req.user,
        quizzes: quizzes,
      });
    });
  } else {
    console.info(req.user);
    res.render('quiz', { user: req.user });
  }
});

module.exports = router;
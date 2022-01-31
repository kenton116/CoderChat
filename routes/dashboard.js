const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Quiz = require('../models/quiz');
const config = require('../config')
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/', authenticationEnsurer, csrfProtection,(req, res, next) => {
  if (req.user) {
    Quiz.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt', 'DESC']]
    }).then(quizzes => {
      Quiz.findAll({
        order: [['badReview', 'DESC']]
      }).then((allQuiz) => {
        res.render('dashboard', {
          user: req.user,
          quizzes: quizzes,
          allQuiz: allQuiz,
          adminGoogle: config.admin.google,
          adminGithub: config.admin.github,
          csrfToken: req.csrfToken()
        });
      });
    });
  } else {
    res.render('quiz', { 
      user: req.user,
      csrfToken: req.csrfToken()
     });
  }
});

module.exports = router;
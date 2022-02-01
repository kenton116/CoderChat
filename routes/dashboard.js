const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Quiz = require('../models/quiz');
// const config = require('../config-local');

router.get('/', authenticationEnsurer,(req, res, next) => {
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
          // adminGoogle: process.env.ADMIN_GOOGLE || config.admin.google,
          adminGithub: process.env.ADMIN_GITHUB /*|| config.admin.github*/,
        });
      });
    });
  } else {
    res.render('quiz', { 
      user: req.user,
     });
  }
});

module.exports = router;
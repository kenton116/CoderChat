'use strict';

function ensure(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login' , {
    alert: 'ページを見るためにはログインが必要です。'
  });
}

module.exports = ensure;
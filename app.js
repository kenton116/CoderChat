const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const quizRouter = require('./routes/quiz');
const dashboardRouter = require('./routes/dashboard');
const roomRouter = require('./routes/room');
const docsRouter = require('./routes/docs');
const config = require('./config');
const app = express();

const User = require('./models/user');
const Quiz = require('./models/quiz');
(async () => {
  await User.sync({ alter: true });
  Quiz.belongsTo(User, { foreignKey: 'user_id' });
  await Quiz.sync({ alter: true });
})();

const passport = require('passport');
const session = require('express-session');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GitHubStrategy = require('passport-github2').Strategy;

const GITHUB_CLIENT_ID = process.env.GITHUB_ID || config.github.clientKey;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_SECRET || config.github.clientSecret;
const GITHUB_CALLBACKURL = process.env.GITHUB_CALLBACK || config.github.callbackURL;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// const clientID = process.env.GOOGLE_ID || config.google.clientKey;
// const clientSecret = process.env.GOOGLE_SECRET || config.google.clientSecret;
// const callbackURL = process.env.GOOGLE_CALLBACK || config.google.callbackURL;
// passport.use(new GoogleStrategy({
//   clientID, clientSecret, callbackURL
// }, function (accessToken, refreshToken, profile, done) {
//   process.nextTick(function () {
//     User.upsert({
//       userId: profile.id,
//       username: profile.displayName
//     }).then(() => {
//       return done(null, { id: profile.id, username: profile.displayName });
//     });
//   })
// }
// ));

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: GITHUB_CALLBACKURL
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.upsert({
        userId: profile.id,
        username: profile.username
      }).then(() => {
        return done(null, profile);
      });
    });
  }
));

app.use(
  session({
    secret: process.env.SECRET2 || config.session.secret2,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.get('/auth/google', passport.authenticate('google', {
//   scope: ['email', 'profile']
// }));

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/auth/google' }),
//   function (req, res) {
//     res.redirect('/dashboard');
//   });

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/dashboard');
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/quiz', quizRouter);
app.use('/dashboard', dashboardRouter);
app.use('/room', roomRouter);
app.use('/docs', docsRouter);

app.use(session({
  secret: process.env.SECRET || config.session.secret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { user: req.user });
});

module.exports = app;
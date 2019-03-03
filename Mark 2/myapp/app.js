let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let home = require('./routes/home');
let login = require('./routes/login');
let lost = require('./routes/lost');
let methods = require('./routes/methods');
let signup_with = require('./routes/signup_with');
let signup_without = require('./routes/signup_without');
let test_score = require('./routes/test_score');
let submit_form_signup_without = require('./routes/submit_form_signup_without');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', home);
app.use('/login', login);
app.use('/lost', lost);
app.use('/methods', methods);
app.use('/signup_with', signup_with);
app.use('/signup_without', signup_without);
app.use('/test_score', test_score);
app.use('/submit_form_signup_without', submit_form_signup_without);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

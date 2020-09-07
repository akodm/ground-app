var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let config = {};
process.env.NODE_ENV === "development" ? config = require("./server-config") : config = require("./server-config");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mapsRouter = require('./routes/maps');
var followsRouter = require('./routes/follows');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", config.client_url);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/maps', mapsRouter);
app.use('/follows', followsRouter);

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
  console.log(err);
  res.send(false);
});

module.exports = app;

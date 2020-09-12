let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('../routes/home/main');
let manageUsersRouter = require('../routes/home/manageUsers');

let loginRouter = require('../routes/users/login');
let createAccountRouter = require('../routes/users/createAccount');
let allUsersRouter = require('../routes/users/allUsers');
let editUserRouter = require('../routes/users/editUser');
let addUserRouter = require('../routes/users/addUser');


require('./seed');

let app = express();


// database setup
let mongoose = require('mongoose');
let DB = require('./db');

mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true});

let mongoDB= mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error: '));
mongoDB.once('open', () => {
  console.log("Connected to MongoDB...");
});
mongoDB.once('disconnected', () => {
  console.log("Disconnected from MongoDB...")
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/createAccount', createAccountRouter);
app.use('/manageUsers', manageUsersRouter);
app.use('/allUsers', allUsersRouter);
app.use('/editUser', editUserRouter);
app.use('/addUser', addUserRouter);


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

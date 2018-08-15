var createError = require('http-errors');
var express = require('express');
var path = require('path');//inbuilt module in node
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('example1:app');//?????
var config = require('./config');
var config = require('./config');
var jwt = require('express-jwt');


var mongoose = require('mongoose');
mongoose.connect(config.mongoDbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongodb");
});

var indexRouter = require('./routes/index');//shows the index.js module
var usersRouter = require('./routes/users');//shows the users.js module

//it accessible only when defined in each .js file....module.exports = router;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.baseUrl = config.baseUrl;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieSecret));//This takes all the cookies the client sends and puts them in request.cookies ......and respose through response.cookies
app.use(express.static(path.join(__dirname, 'public')));//serves static assets from your public folder


app.use('/', indexRouter);//for index
app.use('/users', jwt({
  secret: config.secret,//secret key
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.signedCookies && req.signedCookies.token) {
      return req.signedCookies.token;//req.signedCookies used when cookies are signed
      //if not signed ......req.cookies.name
      //also possible to send token through header through querry string....?mark..url
    }
    return null;
  }
}), usersRouter);//for users

//app.use('/contactus',contactusRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err.name === 'UnauthorizedError') {
    res.redirect('/login');//unlogined users
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;//

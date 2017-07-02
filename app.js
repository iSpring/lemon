var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var compression = require('compression');
var sassMiddleware = require('node-sass-middleware');
var config = require('./config');
var router = require('./router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev', {
  skip: function(req, res){
    return res.statusCode < 400;
  }
}));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
var RedisStore = require('connect-redis')(session);
app.use(session({
  name: config.sessionName,
  secret: config.sessionSecret,
  saveUninitialized: false,
  resave: false,
  store: new RedisStore({
    host: config.redisHost,
    port: config.redisPort,
    db: config.redisDb,
    pass: config.redisPassword
  })
}));
// app.use(function(req, res, next){
//   if(!req.session){
//     //lose connection to Redis and get request when auto-reconnect to Redis
//     return next(new Error("req.session is null"));
//   }
//   next();
// });
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true, // true = .sass and false = .scss
//   sourceMap: true
// }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(3344, function(){
  console.log('lemon listening on port 3344...');
});

module.exports = app;

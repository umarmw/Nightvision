var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookie = require('cookie-parser');
var errorHandler = require('errorhandler');
var passport = require('passport');
var flash = require('express-flash');
require('dotenv').config();

var app = express();
app.set('port', process.env.APP_PORT); //process.env.PORT ||
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/test", express.static(__dirname + '/test'));

app.use(cookie());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8',
                  cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }
                }));
// or app.use(session({ secret: 'session secret key' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

if (app.get('env') == 'development') {
  app.use(errorHandler());
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME);
  var db = mongoose.connection;
  db.on('error', function (err) {
    console.log('DB connection error', err);
  });
  db.once('open', function () {
    console.log('DB connected.');
  });
} else {
  mongoose.connect('mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME);
}

app.auth = require('./app/controllers/middleware');
require('./app/routes/auth')(app);
require('./app/routes')(app);
require('./app/routes/program')(app);
require('./app/routes/report')(app);
require('./app/routes/management/program')(app);
require('./app/routes/management/category')(app);
require('./app/routes/management/testcase')(app);
require('./app/routes/api')(app);

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.render('error', { error: err });
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

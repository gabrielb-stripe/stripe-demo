require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const cookieSession = require('cookie-session');
var path = require('path');
var logger = require('morgan');
var sessionSecret = process.env.SESSION_SECRET || "development"

const app = express();

// Configure cookie sessions
app.use(cookieSession({
  secret: sessionSecret,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Automatically pass session data to Handlebars
app.use(function(req, res, next) {
  app.locals.session = req.session;
  next();
})

// Configure template engine and main template file
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
      // Add helpers here
  }
}));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// Routes
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

// port where app is served
app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});

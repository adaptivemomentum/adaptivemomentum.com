/**
 * Module dependencies
 */

var debug = require('debug')('mat.io:home'),
    express = require('express'),
    app = module.exports = express();

/**
 * Config
 */

app.set('views', __dirname);
app.set('view engine', 'jade');

/**
 * Routes
 */

app.get('*', function(req, res, next) {
  debug('rendering home');
  res.render('home');
});

/**
 * Module dependencies
 */

var debug = require('debug')('mat.io:home'),
    express = require('express'),
    app = module.exports = express(),
    Post = require('../post/model');

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
  Post.all(function(err, posts) {
    if(err) return next(err);
    posts = posts.map(function(post) { return post.toJSON(); });
    res.render('home', { posts : posts });
  });
});

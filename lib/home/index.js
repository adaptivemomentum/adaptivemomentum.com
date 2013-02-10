/**
 * Module dependencies
 */

var debug = require('debug')('mat.io:home'),
    express = require('express'),
    app = module.exports = express(),
    Post = require('post/model');

/**
 * Config
 */

app.set('views', __dirname);
app.set('view engine', 'jade');

/**
 * Routes
 */

app.get('/:slug', function(req, res, next) {
  var slug = req.params.slug;
  Post.find({ slug : slug }, function(err, post) {
    if(err) return next(err);
    else if(!post) return res.redirect('/');
    res.render('home', { posts : [ post.toJSON() ]});
  });
});

app.get('*', function(req, res, next) {
  debug('rendering home');
  Post.all(function(err, posts) {
    if(err) return next(err);
    posts = posts.map(function(post) { return post.toJSON(); });
    res.render('home', { posts : posts });
  });
});

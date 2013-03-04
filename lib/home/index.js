/**
 * Module dependencies
 */

var debug = require('debug')('mat.io:home'),
    express = require('express'),
    app = module.exports = express(),
    Post = require('post/model'),
    moment = require('moment');

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

    var json = post.toJSON();
    json.created_at = format(json.created_at);

    res.render('home', { posts : [ json ]});
  });
});

app.get('*', function(req, res, next) {
  debug('rendering home');
  Post.all(function(err, posts) {
    if(err) return next(err);

    posts = posts.sort(byDate).map(function(post) {
      var json = post.toJSON();
      json.created_at = format(json.created_at);
      return json;
    });

    res.render('home', { posts : posts });
  });
});

/**
 * Format date
 *
 * @param {String} date
 * @return {String} relative date
 */

function format(date) {
  var date = moment(date).format('MMM D  YYYY');
  date = date.toUpperCase();
  date = '<span>' + date.split('  ').join('</span><span>') + '</span>';
  return date;
}

/**
 * Sort by date
 */

function byDate(a,b){
  a = new Date(a.created_at());
  b = new Date(b.created_at());
  return (a < b) ? 1 : (a > b) ? -1 : 0;
};

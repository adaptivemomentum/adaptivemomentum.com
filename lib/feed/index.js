/**
 * Module Dependencies
 */

var RSS = require('rss'),
    express = require('express'),
    Post = require('post/model'),
    app = module.exports = express();

/**
 * Feed
 */

var rss = {
  title : 'Matthew Mueller',
  description : 'Writing by Matthew Mueller',
  feed_url : 'http://mat.io/rss',
  site_url : 'http://mat.io',
  image_url : 'http://mat.io/head/images/logo.png',
  author : 'Matthew Mueller'
};

/**
 * Routes
 */

app.get('/rss', function(req, res, next) {
  var feed = new RSS(rss);

  Post.all(function(err, posts) {
    if(err) return next(err);

    posts.sort(byDate).forEach(function(post) {
      post = post.toJSON();
      feed.item({
        title:  post.title,
        description: post.content,
        url: 'http://mat.io/' + post.slug,
        guid : post.key,
        author: 'Matthew Mueller',
        date: post.created_at
      })
    });

    res.send(feed.xml());
  })
});

/**
 * Sort by Date
 */

function byDate(a,b){
  a = new Date(a.created_at());
  b = new Date(b.created_at());
  return (a < b) ? 1 : (a > b) ? -1 : 0;
};

/**
 * Listen
 */

if(!module.parent) {
  app.listen(port);
  console.log('Server started on port', port);
}


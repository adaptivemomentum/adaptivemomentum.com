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
    posts.forEach(function(post) {
      post = post.toJSON();
      feed.item({
        title:  post.title,
        description: post.content,
        url: 'http://mat.io/' + post.slug,
        author: 'Matthew Mueller',
        date: post.created_at
      })
    });

    res.send(feed.xml());
  })
});

/**
 * Listen
 */

if(!module.parent) {
  app.listen(port);
  console.log('Server started on port', port);
}

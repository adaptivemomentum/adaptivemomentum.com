/**
 * Module Dependencies
 */

var model = require('modella'),
    mongo = require('model-mongo')('localhost/matio'),
    moment = require('moment'),
    markdown = require('marked');

/**
 * Markdown settings
 */

markdown.setOptions({
  gfm : true,
  sanitize : true
});

/**
 * Expose `Post`
 */

var Post = module.exports = model('post')
  .attr('_id')
  .attr('title')
  .attr('slug')
  .attr('content')
  .attr('tags')
  .attr('created_at')
  .attr('updated_at');


/**
 * Plugins
 */

Post.use(mongo);

// formatting
Post.use(function(Post) {
  Post.on('saving', function(post) {
    // markdown
    post.content(markdown(post.content()));
    // relative dates
    post.created_at(moment().from(post.created_at(), true) + ' ago');
  });
});

/**
 * Index slug
 */

Post.index('slug', { unique : true });

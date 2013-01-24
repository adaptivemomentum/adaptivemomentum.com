/**
 * Module Dependencies
 */

var model = require('modella'),
    mongo = require('model-mongo')('localhost/matio'),
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

Post.use(function(Post) {
  Post.on('saving', function(post) {
    post.content(markdown(post.content()));
  });
});

/**
 * Index slug
 */

Post.index('slug', { unique : true });

/**
 * Module Dependencies
 */

var model = require('modella'),
    mongo = require('model-mongo')('localhost/matio'),
    slug = require('model-slug'),
    timestamps = require('model-timestamps'),
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
  .attr('key')
  .attr('title')
  .attr('slug')
  .attr('content')
  .attr('tags')
  .attr('version');


/**
 * Plugins
 */

Post.use(mongo);
Post.use(slug('title'));
Post.use(timestamps);

// formatting
Post.use(function(Post) {
  Post.on('saving', function(post) {
    // markdown
    post.content(markdown(post.content()));
  });
});

/**
 * Index slug
 */

Post.index('slug', { unique : true });

/**
 * Relative date
 *
 * @param {String} date
 * @return {String} relative date
 */

function format(date) {
  return moment(date).format('D MMM');
}

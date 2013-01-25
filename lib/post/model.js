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
    var date = relative(post.created_at());
    date = '<span>' + date.split(' ').join('</span><span>') + '</span>';
    post.created_at(date);
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

function relative(date) {
  var rel = moment().from(date, true);
  rel = rel.replace(/an?/, '1');
  return rel + ' ago';
}

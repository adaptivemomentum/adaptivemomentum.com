/**
 * Module Dependencies
 */

var model = require('modella'),
    mongo = require('model-mongo')('localhost/matio'),
    slug = require('model-slug'),
    timestamps = require('model-timestamps'),
    hl = require('highlight.js'),
    moment = require('moment'),
    markdown = require('marked');

/**
 * Markdown settings
 */

markdown.setOptions({
  gfm : true,
  sanitize : true,
  highlight: function(code, lang) {
    // differences between marked and highlight.js
    lang = ('js' != lang) ? lang : 'javascript';
    lang = ('html' != lang) ? lang : 'xml';
    lang = ('shell' != lang) ? lang : 'bash';

    if(!lang) return code;

    // Let's not let syntax highlighting kill anything
    try {
      return hl.highlight(lang, code).value;
    } catch(e) {
      console.error(lang, e);
      return code;
    }
  }
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

/**
 * Module Dependencies
 */

var model = require('modella'),
    mongo = require('model-mongo')('localhost/am'),
    slug = require('modella-slug'),
    timestamps = require('model-timestamps'),
    hl = require('highlight.js'),
    cheerio = require('cheerio'),
    moment = require('moment'),
    marked = require('marked');

/**
 * Mappings between marked and highlight.js
 */

var language = {
  'js' : 'javascript',
  'html' : 'xml',
  'shell' : 'bash'
};

/**
 * Marked settings
 */

marked.setOptions({
  gfm : true,
  sanitize : false,
  langPrefix : 'lang ',
  highlight: function(code, lang) {
    if(!lang || lang == 'raw') return code;

    // differences between marked and highlight.js
    lang = (language[lang]) ? language[lang] : lang;

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
  .attr('short')
  .attr('version');

/**
 * Formatting
 */

Post.use(function(Post) {
  Post.on('saving', markdown);
  Post.on('saving', format);
});

/**
 * Plugins
 */

Post.use(mongo);
Post.use(slug('title'));
Post.use(timestamps);

/**
 * Set the title
 */

function format(post) {
  var content = post.content(),
      $ = cheerio.load(content);

  // title
  var $title = $('h1').eq(0);

  // hack to remove title on nvalt
  if ($title) {
    var str = $.html($title);
    var i = content.indexOf(str);
    content = content.slice(i + str.length).trim();
    post.content(content);
  }

  title = $title.text() || '';
  post.title(title);

  // short
  var sep = '<hr>';
  var i = content.indexOf(sep);
  var shorty = $('p').eq(0).text() || '';

  if (~i) {
    shorty = content.slice(0, i);
    content = content.replace(sep, '');
    post.content(content);
  }

  post.short(shorty.trim());
}

/**
 * Convert to markdown
 */

function markdown(post) {
  post.content(marked(post.content()));
}

/**
 * Index slug
 */

Post.index('slug', { unique : true });

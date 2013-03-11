/**
 * Module Dependencies
 */

var model = require('modella'),
    mongo = require('model-mongo')('localhost/matio'),
    slug = require('model-slug'),
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
  sanitize : true,
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
 * Plugins
 */

Post.use(mongo);
Post.use(slug('title'));
Post.use(timestamps);

// formatting
Post.use(function(Post) {
  Post.on('saving', markdown);
  Post.on('saving', embed);
  Post.on('saving', short);
});

function markdown(post) {
  post.content(marked(post.content()));
}

/**
 * Embed raw code right on page
 */

function embed(post) {
  var $ = cheerio.load(post.content());
  $('.lang.raw').each(function() {
    var content = $(this).text(),
        $pre = $(this).parent();

    $pre.before(content);
    $pre.remove();
  });

  post.content($.html());
}

/**
 * Create a short
 */

function short(post) {
  var $ = cheerio.load(post.content()),
      str = $('p').eq(0).text();

  post.short(str);
}

/**
 * Index slug
 */

Post.index('slug', { unique : true });

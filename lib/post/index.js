/**
 * Module Dependencies
 */

var port = process.argv[2] || 9000,
    express = require('express'),
    moment = require('moment'),
    Post = require('./model'),
    app = module.exports = express();

/**
 * Configuration
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

    res.render('post', { post : json });
  });
});

/**
 * Format date
 *
 * TODO: Make more DRY
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
 * Listen
 */

if(!module.parent) {
  app.listen(port);
  console.log('Server started on port', port);
}

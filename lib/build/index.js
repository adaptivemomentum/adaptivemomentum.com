
/**
 * Module dependencies.
 */

var Builder = require('component-builder')
  , templates = require('./templates')
  , rework = require('./rework')
  , fs = require('fs')
  , write = fs.writeFileSync

/**
 * Component builder middleware.
 */

exports = module.exports = function(req, res, next){
  return build(next);
};

/**
 * Build
 */

var build = exports.build = function(fn) {
  var builder = new Builder('.');
  builder.addLookup('lib'); // TODO: shouldn't be necessary
  builder.copyAssetsTo('build');
  builder.use(rework);
  builder.use(templates);
  builder.build(function(err, res){
    if (err) return fn(err);
    write('build/build.js', res.require + res.js);
    write('build/build.css', res.css);
    fn && fn();
  });
};

/**
 * Module Dependencies
 */

var auth = require(process.env.HOME + '/credentials.json').simplenote,
    Batch = require('batch'),
    SimpleNote = require('simplenote'),
    Post = require('../post/model');

/**
 * Create the note model with the credentials
 */

var Note = new SimpleNote(auth.email, auth.password);

/**
 * Expose Sync
 */

module.exports = Sync;

/**
 * Initialize Sync
 */

function Sync(tag) {
  if(!(this instanceof Sync)) return new Sync(tag);
  this.tag = tag;
};

/**
 * Synchronize
 */

Sync.prototype.sync = function(fn) {
  fn = fn || function() {};

  var self = this,
      batch = new Batch,
      tag = this.tag;

  Note.all(function(err, notes) {
    if(err) return fn(err);
    notes = notes.select(function(note) { return ~note.tags.indexOf(tag); })
    if(!notes.length) return fn();

    notes.each(function(note) {
      var action = (note.deleted) ? 'remove' : 'update';
      batch.push(function(done) { self[action](note, done); });
    });

    batch.end(fn);
  });
};

/**
 * Update the posts
 *
 * @param {Object} note index
 * @param {Function} next
 */

Sync.prototype.update = function(note, next) {
  var key = note.key;

  Post.find({ key : key }, function(err, post) {
    if(err) return next(err);
    else if(post && (post.version() >= note.version)) return next();

    if(!post) post = new Post({ key : key });

    Note.get(key, function(err, note) {
      if(err) return next(err);

      var i = note.content.indexOf('\n\n'),
          title = note.content.substring(0, i),
          content = note.content.slice(i).trim();

      post.title(title);
      post.content(content);
      post.tags(note.tags);
      post.version(note.version);

      post.save(next);
    });
  });
};

/**
 * Remove posts
 *
 * @param {Object} note index
 * @param {Function} next
 */

Sync.prototype.remove = function(note, next) {
  var key = note.key;

  Post.find({ key : key }, function(err, post) {
    if(err) return next(err);
    else if(!post) return next();
    post.remove(next);
  });
}

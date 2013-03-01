/**
 * Module Dependencies
 */

var auth = require(process.env.HOME + '/credentials.json').simplenote,
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

function Sync = function() {
  Note.all(function(err, notes) {
    // get posts, get notes, compare modified dates, update if necessary
  });
};

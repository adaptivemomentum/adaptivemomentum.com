/**
 * Module Dependencies
 */

var express = require('express'),
    app = module.exports = express(),
    wordsmith = require('wordsmith')('mrixa6vy'),
    Post = require('../post/model');

/**
 * Attach to server
 */

note = wordsmith.attach(app);

/**
 * publish or update
 */

note.on('publish', save);
note.on('update', save);

/**
 * Save
 */

function save(note) {
  Post.find({ slug : note.slug }, function(err, post) {
    if(err) throw new Error(err);
    if(!post) post = new Post;

    post.set(note);
    post.save();
  });
}

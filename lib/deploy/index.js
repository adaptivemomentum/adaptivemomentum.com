/**
 * Module Dependencies
 */

var hook = require('gh-hook'),
    auth = require(process.env.HOME + '/credentials.json')['mat.io'];

/**
 * Expose `hook`
 */

module.exports = hook('/deploy')
  .auth(auth.username, auth.password)
  .branch('master')
  .exec('git pull origin master')
  .exec('make clean build minify')
  .exec('kill `expr $(cat pids/web.pid) + 1`');


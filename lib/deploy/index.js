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
  .exec('mongroup stop matio0')
  .exec('mongroup start matio0')
  .exec('sleep 10')
  .exec('mongroup stop matio1')
  .exec('mongroup start matio1')


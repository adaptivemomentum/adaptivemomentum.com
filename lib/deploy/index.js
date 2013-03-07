/**
 * Module Dependencies
 */

var hook = require('gh-hook'),
    auth = require(process.env.HOME + '/credentials.json')['mat.io'],
    spawn = require('child_process').spawn;

/**
 * Expose `hook`
 */

module.exports = hook('/deploy')
  .auth(auth.username, auth.password)
  .branch('master')
  .deploy(deploy);

/**
 * Deploy function
 */

function deploy(body) {
  make = spawn('make', [ 'production', 'minify'])

  make.stderr.on('data', function(data) {
    console.error(data.toString('utf8'));
  });

  make.on('exit', function(code) {
    console.log('exiting...', code);
    process.exit(0);
  });
}


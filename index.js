/**
 * Module dependencies.
 */

var port = process.argv[2] || 3001,
    express = require('express'),
    app = module.exports = express();

/**
 * Configuration
 */

app.use(express.favicon());
app.use(express.bodyParser());

app.configure('production', function() {
  app.use(express.compress());
});

app.use(express.static(__dirname + '/build'));

app.configure('development', function(){
  app.use(require('build'));
  app.use(express.logger('dev'));
});

/**
 * Mount
 */

app.use(require('./lib/wordsmith'));
app.use(require('post'));
app.use(require('home'));

app.configure('development', function() {
  app.use(express.errorHandler());
});

/**
 * Listen
 */

var server = app.listen(port, function() {
  console.log("listening on port %s", port);
});

/**
 * Graceful shutdown
 */

function shutdown() {
  console.log('closing...');
  server.close();
  redis.client.quit();

  // arbitrary 2 seconds
  setTimeout(function() {
    console.log('closed');
    process.exit(0);
  }, 2000);
}

process.on('SIGTERM', shutdown);
process.on('SIGQUIT', shutdown);

/**
 * Module dependencies.
 */

var port = process.argv[2] || 3001,
    express = require('express'),
    app = module.exports = express(),
    Sync = require('sync'),
    auth = require(process.env.HOME + '/credentials.json').simplenote;

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

app.use(require('home'));

app.configure('development', function() {
  app.use(express.errorHandler());
});

/**
 * Periodically query simple note for changes
 */

var sync = Sync('mat.io');
setInterval(sync.sync.bind(sync), 15000);

sync.sync(function(err) {
  if(err) throw err;
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

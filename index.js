/* jshint node: true */
'use strict';

var runner = require('karma').runner;
var server = require('karma').server;
var gutil = require('gulp-util');
var es = require('event-stream');
var _ = require('lodash');
var path = require('path');
var spawn = require('child_process').spawn;

var karmaPlugin = function (options) {

  return es.map(function (file, done) {
    var _options = {
      background: false,
      singleRun: true,
      files: [file.path]
    };

    var data = _.merge(_options, options);

    if (data.configFile) {
      data.configFile = path.resolve(data.configFile);
    }

    //gutil.log(data);
    var args = [path.join(__dirname , 'lib', 'server_process.js'), JSON.stringify(data)];

    es.child(spawn('node', args))
      .on('close', function () { done(null, file); })
      .pipe( es.map(function (raw, callback) {
        if (raw[0] !== 123){// doesn't begin with '{'
          process.stdout.write(raw.toString());
        }else{
          file.karma = JSON.parse(raw.toString());
        }
        callback();
      }));

  });
};

karmaPlugin.loadReporter = function(reporter) {

  // we want the function
  if (typeof reporter === 'function') return reporter;

  // object reporters
  if (typeof reporter === 'object' && typeof reporter.reporter === 'function') return karmaPlugin.loadReporter(reporter.reporter);

  // load jshint built-in reporters
  if (typeof reporter === 'string') {
    try {
      return karmaPlugin.loadReporter(require(path.join(__dirname, 'reporters', reporter)));
    } catch (err) {}
  }

  // load full-path or module reporters
  if (typeof reporter === 'string') {
    try {
      return karmaPlugin.loadReporter(require(reporter));
    } catch (err) {}
  }
};


karmaPlugin.reporter = function(reporter){

  if (!reporter) reporter = 'default';
  var rpt = karmaPlugin.loadReporter(reporter);

  if (typeof rpt !== 'function') {
    throw new Error('Invalid reporter');
  }

  // return stream that reports stuff
  return es.map(function (file, cb) {

    // nothing to report
    if (!file.karma) return cb(null, file);

    rpt(file.karma);
    return cb(null, file);
  });
};

module.exports =  karmaPlugin;

var runner = require('karma').runner;
var server = require('karma').server;
var gutil = require('gulp-util');
var es = require('event-stream');
var _ = require('lodash');
var path = require('path');

module.exports = function (options) {

  return es.map(function () {
    var _options = {
      background: false,
    };

    var data = _.merge(_options, options);

    if (data.configFile) {
      data.configFile = path.resolve(data.configFile);
    }

    gutil.log(data);
    server.start(data);
  });
};

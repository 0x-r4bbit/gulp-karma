/* jshint node : true */

'use strict';

var gutil = require('gulp-util');
var util = require('util');

var URL_REGEXP = new RegExp('http:\\/\\/[^\\/]*' +
                            '\\/(base|absolute)([^\\?\\s\\:]*)(\\?\\w*)?', 'g');

function formatError(msg, indentation) {
  // remove domain and timestamp from source files
  // and resolve base path / absolute path urls into absolute path
  msg = (msg || '').replace(URL_REGEXP, function(full, prefix, path) {
    if (prefix === 'base') {
      return '/' + path;
    } else if (prefix === 'absolute') {
      return path;
    }
  });

  // indent every line
  if (indentation) {
    msg = indentation + msg.replace(/\n/g, '\n' + indentation);
  }

  return msg + '\n';
}

module.exports = function(karmaData){
  var out = '';
  var ids = Object.keys(karmaData.browsers);

  function outputError(result){
    if (!result.success){
      out += gutil.colors.red(util.format('%s FAILED\n',result.suite.join(' ') + ' ' + result.description))  ;
    }
    for (var i = 0, l = result.log.length; i < l; i++){
      out += formatError(result.log[i], '\t');
    }
  }

  for (var i = 0, l = ids.length; i < l; i++){
    var browser = karmaData.browsers[ids[i]];
    var results = browser.lastResult;
    var totalExecuted = results.success + results.failed;

    out += util.format('%s: Executed %d of %d', browser.name, totalExecuted, results.total);

    if (results.failed) {
      out += util.format(gutil.colors.red(' (%d FAILED)'), results.failed);
    }

    if (results.skipped) {
      out += util.format(' (skipped %d)', results.skipped);
    }

    out += '\n';
    karmaData.result[browser.id].forEach(outputError);
  }

  var finalResult = karmaData.summary;

  if (!finalResult.error) {
    if (finalResult.failed) {
       out += util.format(gutil.colors.red('TOTAL: %d FAILED, %d SUCCESS\n'), finalResult.failed, finalResult.success);
    } else {
      out += util.format(gutil.colors.green('TOTAL: %d SUCCESS\n'), finalResult.success);
    }
  }


  process.stdout.write(out);
};

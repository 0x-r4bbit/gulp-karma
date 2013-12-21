/* jshint node : true */

'use strict';

var gutil = require('gulp-util');
var util = require('util');

module.exports = function(karmaData){
  var out = '';
  var ids = Object.keys(karmaData.browsers);

  var current_suite = [];
  var base_indent = 2;


  var SPEC_SUCCESS = gutil.colors.green('✓ %s\n');
  var SPEC_FAILED  = gutil.colors.red('✖ %s\n');

  function indent(n) {
    return new Array(n+base_indent).join('  ');
  }

  function outputCurrentSuite(suite){
    for(var i = 0, n = suite.length; i < n; i++){
      if (current_suite.length <= i || current_suite[0] !== suite[0]){
        out += i === 0 ? '\n' : '';
        out += indent(i) + suite[i] + '\n';
      }
    }
    current_suite = suite;
    return i;
  }

  function output(result){
    if (result.skipped) return;

    outputCurrentSuite(result.suite);

    out += util.format(
      indent(result.suite.length) + (result.success ? SPEC_SUCCESS : SPEC_FAILED),
      result.description
    );
  }


  for (var i = 0, l = ids.length; i < l; i++){
    var browser = karmaData.browsers[ids[i]];
    var results = browser.lastResult;
    var totalExecuted = results.success + results.failed;

    out += '\n\n';

    out += util.format('%s: Executed %d of %d', browser.name, totalExecuted, results.total);

    if (results.failed) {
      out += util.format(gutil.colors.red(' (%d FAILED)'), results.failed);
    }

    if (results.skipped) {
      out += util.format(' (skipped %d)', results.skipped);
    }

    out += '\n';

    current_suite = [];
    karmaData.result[browser.id].forEach(output);
  }

  out += '\n\n';

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

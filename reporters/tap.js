/* jshint node : true */

/**
 * The TAP reporter emits lines for a [Test-Anything-Protocol consumer](http://en.wikipedia.org/wiki/Test_Anything_Protocol).
 */

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

    var msg = '';
    if (result.skipped)
      msg = 'ok %d %s # SKIP -';
    else if (result.success)
      msg = 'ok %d %s';
    else
      msg = 'not ok %d %s';

    out += util.format(msg + '\n', result.id, result.suite.join(' ') + ' ' + result.description );
  }


  for (var i = 0, l = ids.length; i < l; i++){
    var browser = karmaData.browsers[ids[i]];
    var results = browser.lastResult;
    var resultArray = karmaData.result[browser.id];

    out += util.format('%d..%d\n', resultArray[0].id, resultArray[resultArray.length - 1].id);

    karmaData.result[browser.id].forEach(output);


    out += '# browser ' + browser.name + '\n';
    out += '# tests ' + (results.success + results.failed) + '\n';
    out += results.skipped ? '# skip ' + results.skipped + '\n' : '' ;
    out += '# pass ' + results.success + '\n';
    out += results.failed ? '# fail ' + results.failed + '\n' : '' ;
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

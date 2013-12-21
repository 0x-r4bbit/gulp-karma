/* jshint node: true */
'use strict';

var karma = require('./index');
var gulp = require('gulp');

gulp.task('default', function(cb){
  var options = {
    configFile: 'karma.conf.js',
    reporters : ['json']
  };

  if (process.env.TRAVIS)
    options.browsers = [ 'Firefox', 'PhantomJS'];

  gulp.src('test/*.js')
   .pipe(karma(options))
   .pipe(karma.reporter())
   .pipe(karma.reporter('spec'))
   .on('end', cb);
});

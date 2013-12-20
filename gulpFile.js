/* jshint node: true */
'use strict';

var karma = require('./index');
var gulp = require('gulp');

gulp.task('default', function(cb){
  gulp.src('test/*.js')
   .pipe(karma({
      configFile: 'karma.conf.js',
      reporters : ['json']
    }))
   .pipe(karma.reporter())
   .on('end', cb);
});

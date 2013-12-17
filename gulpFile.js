var karma = require('./index');
var gulp = require('gulp');

gulp.task('default', function () {
  gulp.run(karma({
    configFile: 'karma.conf.js'
  }));
});

var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var sassPaths = [
  'www/bower_components/foundation-sites/scss',
  'www/bower_components/motion-ui/src'
];

gulp.task('sass', function() {
  return gulp.src('www/scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('www/css'));
});

gulp.task('browserify', function() {
  return browserify('www/js/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('www/js'));
});

gulp.task('default', ['sass', 'browserify'], function() {
  gulp.watch(['www/scss/**/*.scss'], ['sass']);
  gulp.watch(['www/js/**/*.js'], ['browserify']);
});

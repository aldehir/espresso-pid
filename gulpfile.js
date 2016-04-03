var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var sassPaths = [
  'web/public/bower_components/foundation-sites/scss',
  'web/public/bower_components/motion-ui/src'
];

gulp.task('sass', function() {
  return gulp.src('web/public/scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('web/public/css'));
});

gulp.task('browserify', function() {
  return browserify('web/public/js/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('web/public/js'));
});

gulp.task('build', ['sass', 'browserify']);

gulp.task('server', function() {
  return $.nodemon({ script: 'application.js',
                     ext: 'js',
                     ignore: ['web/public/**/*'] });
});

gulp.task('default', ['sass', 'browserify', 'server'], function() {
  gulp.watch(['web/public/scss/**/*.scss'], ['sass']);
  gulp.watch(['web/public/js/**/*.js'], ['browserify']);
});

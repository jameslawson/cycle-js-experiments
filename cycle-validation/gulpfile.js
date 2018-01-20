var babelify = require('babelify');
var browserify = require('browserify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var webserver = require('gulp-webserver');

gulp.task('build', function() {
  browserify('./src/main.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('style', function () {
  return gulp.src('./src/style/**/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('serve', function() {
  gulp.src('./dist')
    .pipe(webserver({
      host: '127.0.0.1',
      livereload: true
    })
  );
});

gulp.task('watch', function() {
  gulp.watch(['./src/*.js', './src/**/*.scss'], ['build', 'style'])
});

gulp.task('default', ['build', 'style', 'watch', 'serve']);

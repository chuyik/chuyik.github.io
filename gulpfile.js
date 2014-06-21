// include gulp
var gulp = require('gulp');

// include plugins
var compass = require('gulp-compass'),
  minifyCSS = require('gulp-minify-css');

var paths = {
  styles: {
    src:  'assets/sass',
    dest: 'assets/css'
  },
  images: 'assets/images'
};

gulp.task('sass', function () {
  return gulp.src('assets/sass/*.scss')
    .pipe(compass({
      config_file: 'config.rb',
      css: paths.styles.dest,
      sass: paths.styles.src,
      image: paths.images
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dest));
});
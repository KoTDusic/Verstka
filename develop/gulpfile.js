
const gulp  = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concatCss = require('gulp-concat-css');
const imagemin = require('gulp-imagemin');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const less = require('gulp-less');

const dstpath="../public/";

gulp.task('stream', function () {
    // Endless stream mode 
    livereload.listen();
    gulp.watch(['html/*.*'],['htmlcopy']);
    gulp.watch(['less/*.*'],['less']);
    gulp.watch(['restart/*.*'],['images','fonts']);
});


gulp.task('htmlcopy', function () {
   return gulp.src('html/*.html')
      .pipe(gulp.dest(dstpath))
      .pipe(livereload())
});
gulp.task('less', function () {
   return gulp.src("less/*.less")
        .pipe(plumber())
        .pipe(less())
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(concatCss("styles.css"))
		.pipe(gulpif(argv.production,cleanCSS({compatibility: 'ie8'})))
		.pipe(gulp.dest(dstpath))
        .pipe(livereload())
});

gulp.task('images', function() {
  return gulp.src(['images/**/*.*','images/*.*'])
  .pipe(gulpif(argv.production,imagemin()))
  .pipe(gulp.dest(dstpath+'images'))
  .pipe(livereload())
});
gulp.task('fonts', function() {
  return gulp.src('fonts/*')
  .pipe(gulp.dest(dstpath+'fonts'))
  .pipe(livereload())
});

gulp.task('default',['htmlcopy','less','images','fonts'], function () {
      var text;
      if(argv.production) text= "релизного билда";
      else text = "отладочного билда";
      console.log(`сборка ${text} завершена!`);
});
/*gulp.task('default', function (callback) {
	runSequence('build',['browserRefresh'],callback).pipe();
});*/
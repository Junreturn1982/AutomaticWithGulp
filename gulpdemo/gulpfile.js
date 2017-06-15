const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');

// gulp vet
gulp.task('vet', () => {
    return gulp
            .src([
                './src/**/*.js',
                './*.js'
            ])
            .pipe(jscs())
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish', {verbose: true}));
});

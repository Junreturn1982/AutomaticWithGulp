const gulp = require('gulp');
const args = require('yargs').argv;

const $ = require('gulp-load-plugins')({lazy: true});

// const jshint = require('gulp-jshint');
// const jscs = require('gulp-jscs');
// const util = require('gulp-util');
// const gulpprint = require('gulp-print');
// const gulpif = require('gulp-if');

// gulp vet
gulp.task('vet', () => {
    log('Analyzing source with JSHint and JSCS');
    return gulp
            .src([
                './src/**/*.js',
                './*.js'
            ])
            .pipe($.if(args.verbose, $.print()))
            .pipe($.jscs())
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
            .pipe($.jshint.reporter('fail'));
});

//
function log(msg) {
    if (typeof(msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
